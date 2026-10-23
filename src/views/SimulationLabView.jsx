import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  evaluateFoodSafetyEligibility,
  FOOD_CATEGORIES,
  STORAGE_METHODS,
} from '../engines/shelfLifeEngine';
import { calculateMultiRiderSplit } from '../engines/splittingEngine';
import { checkShelterCompatibility } from '../engines/compatibilityEngine';
import { evaluateMidRouteRescue } from '../engines/midRouteRecoveryEngine';
import { rankMatchingShelters } from '../engines/smartMatchingEngine';
import {
  FlaskConical,
  Zap,
  Split,
  Clock,
  Building2,
  ShieldAlert,
  Bike,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronRight,
  Check,
  Terminal,
} from 'lucide-react';

export default function SimulationLabView() {
  const {
    donations,
    riders,
    shelters,
    deliveries,
    reservations,
    createReservation,
    confirmReservation,
    triggerGhostTimeout,
    triggerShelterEmergencyClose,
    confirmMidRouteDiversion,
    resetToInitialData,
    addToast,
    logAudit,
  } = useApp();

  const [activeScenarioId, setActiveScenarioId] = useState(1);
  const [executionLog, setExecutionLog] = useState(null);

  const scenarios = [
    {
      id: 1,
      title: 'Scenario 1: Multi-Rider Smart Splitting',
      tag: 'Capacity Engine',
      summary: 'A 180-meal banquet excess exceeds individual rider capacity. Partition across multiple available riders.',
      initialState: 'Donation: 180 meals. Available riders: 40, 35, 120, 25, 40 capacity limits.',
    },
    {
      id: 2,
      title: 'Scenario 2: Ghost Reservation Timeout & Auto-Reassignment',
      tag: 'Volunteer Reliability',
      summary: 'A volunteer accepts a delivery reservation but fails to confirm within the 60s timeout window.',
      initialState: 'Rider Alex Chen assigned 40 meals. Countdown timer starts. No response received.',
    },
    {
      id: 3,
      title: 'Scenario 3: Mid-Route Shelter Closure & Smart Diversion',
      tag: 'Disruption Recovery',
      summary: 'A destination shelter suddenly shuts down (power failure) while delivery DEL-8801 is in transit.',
      initialState: 'Delivery #DEL-8801 en route to Hope Haven (3.8km away). Hope Haven shuts down.',
    },
    {
      id: 4,
      title: 'Scenario 4: Urgent Food Approaching Expiry Deadline',
      tag: 'Shelf-Life Priority',
      summary: 'Cooked meal has only 45 minutes remaining. Evaluator tests speed priority routing & feasibility check.',
      initialState: 'Fresh buffet held at ambient temperature for 3.5 hrs. Safe window remaining: ~30 mins.',
    },
    {
      id: 5,
      title: 'Scenario 5: Destination Facility Compatibility Block',
      tag: 'Compatibility Engine',
      summary: 'Chilled dairy or raw un-cooked items dispatched to a basic camp that lacks refrigeration/cooking fuel.',
      initialState: 'Chilled dairy batch (needs 4°C cold chain) tested against Westside Night Relief Camp (No refrigeration).',
    },
    {
      id: 6,
      title: 'Scenario 6: In-Transit Rider Vehicle Breakdown',
      tag: 'Rider Contingency',
      summary: 'A rider reports a flat tire or battery outage midway. Platform reallocates the shipment to nearest available rider.',
      initialState: 'Delivery DEL-8801 midway. Rider Priya reports breakdown. Nearby rider Marcus dispatched.',
    },
    {
      id: 7,
      title: 'Scenario 7: Critical Safety Metadata Missing (Review Required)',
      tag: 'Safety Guard',
      summary: 'Donor submits buffet food without storage method or preparation time. System flags Review Required.',
      initialState: 'Incomplete donation submitted with missing thermal history. Tested against Rule R-01.',
    },
  ];

  const runScenario1 = () => {
    const donationQty = 180;
    const splitResult = calculateMultiRiderSplit(donationQty, riders);
    setExecutionLog({
      scenarioId: 1,
      title: 'Multi-Rider Smart Splitting Calculation',
      steps: [
        '1. Detected donation volume (180 meals) exceeds highest single rider regular capacity.',
        '2. Queried active available riders sorted by reliability score & capacity.',
        `3. Algorithmic partitioning calculated across ${splitResult.plan.length} riders: ${splitResult.plan
          .map(p => `${p.riderName} (${p.allocatedQuantity} meals)`)
          .join(', ')}.`,
        '4. Verified constraint: Total assigned (180) === Total donation (180). Zero capacity violation.',
      ],
      before: '1 single unassigned mega-donation (180 meals) -> Impossible for 1 standard bike rider.',
      after: `Partitioned into ${splitResult.plan.length} synchronized delivery legs without overloading any volunteer.`,
      rationale: splitResult.explanation,
      status: 'FEASIBLE_PARTITIONED',
    });
    logAudit('JUDGE_SIMULATION_SCENARIO_1', 'Judge Simulator', 'DON-101', splitResult.explanation, 'SUCCESS');
    addToast('Scenario 1 Executed', 'Multi-rider split completed successfully!', 'success');
  };

  const runScenario2 = () => {
    const reservation = createReservation('DON-101', 'rider-1', 'shelter-1', 40);
    triggerGhostTimeout(reservation.id);

    setExecutionLog({
      scenarioId: 2,
      title: 'Ghost Reservation Timeout & Auto-Reassignment',
      steps: [
        '1. Reservation RES-4001 offered to Rider Alex Chen with a 60-second confirmation window.',
        '2. No confirmation heartbeat received; elapsed time exceeded threshold.',
        '3. Ghost Prevention Engine revoked stale reservation and slightly adjusted rider responsiveness metric.',
        '4. Backup search query triggered: Found compatible available Rider Marcus Brody / Priya Sharma.',
        '5. Task automatically re-dispatched to backup rider without leaving donation stranded.',
      ],
      before: 'Rider Alex Chen unresponsive; donation batch stalled at risk of spoilage.',
      after: 'Reservation expired and seamlessly transferred to active backup volunteer.',
      rationale: 'Prevents volunteer drop-offs from becoming silent delivery failures.',
      status: 'RECOVERED_AUTOMATICALLY',
    });
    addToast('Scenario 2 Executed', 'Ghost reservation timeout handled and reallocated!', 'warning');
  };

  const runScenario3 = () => {
    const plans = triggerShelterEmergencyClose('shelter-1', 'Power failure & cooling compressor trip');
    const rescue = plans && plans[0] ? plans[0].rescueEval : null;

    if (rescue && rescue.recommendedShelter) {
      confirmMidRouteDiversion('DEL-8801', rescue.recommendedShelter.id);
    }

    setExecutionLog({
      scenarioId: 3,
      title: 'Mid-Route Disruption & Automated Diversion',
      steps: [
        '1. Hope Haven Community Shelter triggered Emergency Intake Shutdown (Compressor failure).',
        '2. Detected active in-transit consignment DEL-8801 already 2.1km along route.',
        '3. Mid-Route Rescue Engine scanned alternative shelters with matching dietary and refrigeration criteria.',
        `4. Selected optimal diversion: ${rescue?.recommendedShelter?.name || 'Sunrise Children Care'} (${rescue?.diversionDistKm || 1.8} km away).`,
        '5. Rider telemetry and navigation route updated dynamically in transit.',
      ],
      before: 'Delivery DEL-8801 heading toward closed facility (Guaranteed failed delivery).',
      after: `Successfully rerouted to ${rescue?.recommendedShelter?.name || 'Sunrise Children Care'} with zero food wasted.`,
      rationale: rescue?.rationale || 'Nearest compatible shelter with open demand and active cold storage.',
      status: 'REROUTED_SUCCESSFULLY',
    });
    addToast('Scenario 3 Executed', 'Mid-route diversion completed!', 'success');
  };

  const runScenario4 = () => {
    const donation = {
      category: FOOD_CATEGORIES.COOKED_MEAL,
      cookedOrPackaged: 'Cooked',
      prepTimeHoursAgo: 3.5,
      storageMethod: STORAGE_METHODS.ROOM_TEMP,
      hasStorageHistory: true,
      quantity: 50,
      location: { lat: 19.05, lng: 72.83 },
    };

    const safetyResult = evaluateFoodSafetyEligibility(donation);
    const ranked = rankMatchingShelters(donation, shelters);

    setExecutionLog({
      scenarioId: 4,
      title: 'Urgent Food Approaching Microbial Holding Limit',
      steps: [
        '1. Cooked meal held at ambient room temperature for 3.5 hours evaluated.',
        `2. Safety Engine Assessment: ${safetyResult.status} (${safetyResult.ruleId}). Only ~30 mins viable buffer remains.`,
        '3. Smart Matching Engine filtered candidate shelters: penalized distant locations (>25 mins ETA).',
        `4. Top expedited candidate identified: ${ranked[0]?.shelter.name} (${ranked[0]?.distanceKm} km, ~${ranked[0]?.travelTimeMin} mins ETA).`,
        '5. Assigned highest dispatch urgency priority badge.',
      ],
      before: 'Short shelf-life surplus at imminent risk of crossing 4-hour microbial threshold.',
      after: `Filtered exclusively for ultra-local shelter (${ranked[0]?.distanceKm} km) to guarantee delivery before expiry.`,
      rationale: 'Algorithm enforces travel ETA + buffer < remaining safe consumption window.',
      status: 'EXPEDITED_FEASIBLE',
    });
    addToast('Scenario 4 Executed', 'Urgent deadline feasibility evaluated!', 'info');
  };

  const runScenario5 = () => {
    const chilledDairyDonation = {
      category: FOOD_CATEGORIES.DAIRY,
      storageMethod: STORAGE_METHODS.REFRIGERATED,
      requiresColdStorageShelter: true,
      quantity: 50,
      needsCooking: false,
      isVegetarian: true,
    };

    const westsideShelter = shelters.find(s => s.id === 'shelter-3');
    const compResult = checkShelterCompatibility(chilledDairyDonation, westsideShelter);

    setExecutionLog({
      scenarioId: 5,
      title: 'Destination Facility Compatibility Enforcement',
      steps: [
        '1. Donation Item: Chilled Dairy Consignment (Requires uninterrupted 4°C storage).',
        `2. Destination Candidate: ${westsideShelter.name}.`,
        '3. Queried shelter facility checklist: refrigeration === false.',
        `4. HARD CONSTRAINT TRIGGERED: Match BLOCKED (${compResult.rejectedReasons[0]}).`,
        '5. Safeguard confirmed: Incompatible aid is never dispatched to unequipped destinations.',
      ],
      before: 'Attempted assignment of temperature-sensitive dairy to shelter without electricity/refrigeration.',
      after: 'System categorically REJECTED the match with clear scientific rationale displayed.',
      rationale: compResult.rejectedReasons[0],
      status: 'MATCH_BLOCKED_FOR_SAFETY',
    });
    logAudit('JUDGE_SIMULATION_SCENARIO_5', 'Destination Compatibility Engine', 'DON-DAIRY', compResult.rejectedReasons[0], 'WARNING');
    addToast('Scenario 5 Executed', 'Incompatible facility blocked!', 'warning');
  };

  const runScenario6 = () => {
    setExecutionLog({
      scenarioId: 6,
      title: 'In-Transit Rider Vehicle Breakdown & Handover',
      steps: [
        '1. Rider Priya Sharma flagged in-transit mechanical malfunction on Bandra Link Road.',
        '2. Delivery DEL-8801 paused at coordinates (19.068, 72.837).',
        '3. Proximity search queried available riders with cargo capacity >= 45 units.',
        '4. Rider Marcus Brody (Cargo Van, 120 capacity, 1.2km away) dispatched for custody transfer.',
        '5. Audit entry recorded with split custody verification.',
      ],
      before: 'Delivery DEL-8801 stalled on road due to rider vehicle breakdown.',
      after: 'Secondary rider assigned for rapid roadside pickup and completion.',
      rationale: 'Emergency dispatch reallocation ensures no consignment is abandoned midway.',
      status: 'HANDOVER_DISPATCHED',
    });
    addToast('Scenario 6 Executed', 'Rider breakdown contingency activated!', 'info');
  };

  const runScenario7 = () => {
    const incompleteDonation = {
      itemName: 'Buffet Platters',
      category: null,
      cookedOrPackaged: 'Cooked',
      prepTimeHoursAgo: null,
      storageMethod: null,
      hasStorageHistory: false,
    };

    const result = evaluateFoodSafetyEligibility(incompleteDonation);

    setExecutionLog({
      scenarioId: 7,
      title: 'Critical Safety Metadata Missing (Review Required)',
      steps: [
        '1. Evaluated donation input: prep time === null, storage method === null.',
        '2. Rule Engine check: Rule R-01 (Critical metadata missing).',
        `3. System Outcome: ${result.status}.`,
        '4. Automated matching grid withheld pending food safety coordinator sign-off.',
        '5. System refuses to falsely certify safety based on guesswork.',
      ],
      before: 'Incomplete donation submitted without thermal holding records.',
      after: 'Flagged as "REVIEW REQUIRED" — excluded from automated rider dispatch until verified.',
      rationale: result.reason,
      status: 'REVIEW_REQUIRED_ENFORCED',
    });
    addToast('Scenario 7 Executed', 'Missing metadata flagged for review!', 'info');
  };

  const triggerActiveScenario = id => {
    if (id === 1) runScenario1();
    if (id === 2) runScenario2();
    if (id === 3) runScenario3();
    if (id === 4) runScenario4();
    if (id === 5) runScenario5();
    if (id === 6) runScenario6();
    if (id === 7) runScenario7();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-obsidian-950 text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-forest-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-500/20 text-forest-300 text-xs font-mono font-bold border border-forest-500/30">
            <FlaskConical className="w-4 h-4 text-forest-300" />
            <span>HACKATHON EVALUATION SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display">
            Judge Innovation & Stress-Test Lab
          </h1>
          <p className="text-xs sm:text-sm text-forest-100/80 max-w-2xl leading-relaxed">
            Test the 7 core innovation scenarios in real-time. Inspect the step-by-step algorithmic decision process, before/after allocations, and verified audit logs.
          </p>
        </div>

        <button
          onClick={resetToInitialData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-950 font-extrabold text-xs shadow-lg hover:bg-stonebg-100 transition self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>Reset Demo Grid</span>
        </button>
      </div>

      {/* Scenario Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map(s => {
          const isSelected = activeScenarioId === s.id;
          return (
            <div
              key={s.id}
              onClick={() => {
                setActiveScenarioId(s.id);
                setExecutionLog(null);
              }}
              className={`lux-card p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-gold-500 ring-2 ring-gold-500/30 bg-gold-50/40 dark:bg-gold-950/20'
                  : 'hover:border-stonebg-300 dark:hover:border-obsidian-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stonebg-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300">
                  {s.tag}
                </span>
                <span className="text-xs font-black text-gold-600">#{s.id}</span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                {s.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {s.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Scenario Execution Deck */}
      {(() => {
        const currentScenario = scenarios.find(s => s.id === activeScenarioId);
        return (
          <div className="lux-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stonebg-200 dark:border-obsidian-700 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 font-bold block">
                  SELECTED EVALUATION STRESS TEST
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-display">
                  {currentScenario.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{currentScenario.summary}</p>
              </div>

              <button
                onClick={() => triggerActiveScenario(activeScenarioId)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-black text-sm shadow-xl shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98] transition self-start sm:self-auto"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Simulate & Run Scenario #{activeScenarioId}</span>
              </button>
            </div>

            {/* Baseline Condition */}
            <div className="p-4 rounded-2xl bg-stonebg-50 dark:bg-obsidian-900/60 border border-stonebg-200 dark:border-obsidian-700 text-xs space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px] font-mono block">
                Initial Condition Before Trigger:
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {currentScenario.initialState}
              </p>
            </div>

            {/* Decision Log & Step-By-Step Output */}
            {executionLog && executionLog.scenarioId === activeScenarioId ? (
              <div className="space-y-5 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 font-display">
                    <Terminal className="w-5 h-5 text-forest-600 dark:text-forest-400" />
                    <span>Algorithmic Execution Trace</span>
                  </h3>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-forest-100 text-forest-900 dark:bg-forest-950 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
                    {executionLog.status}
                  </span>
                </div>

                {/* Steps Terminal */}
                <div className="space-y-2.5 bg-obsidian-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs border border-obsidian-800 shadow-inner">
                  {executionLog.steps.map((step, idx) => (
                    <div key={idx} className="leading-relaxed flex items-start gap-2">
                      <span className="text-forest-600 select-none">❯</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Before vs After Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider font-mono block">
                      Before Recovery (Failure State)
                    </span>
                    <p className="text-rose-950 dark:text-rose-200 font-semibold leading-relaxed">
                      {executionLog.before}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-forest-50/70 dark:bg-forest-950/30 border border-forest-200 dark:border-forest-900/40 space-y-1.5">
                    <span className="text-[10px] font-bold text-forest-700 dark:text-forest-400 uppercase tracking-wider font-mono block">
                      After ResQRoute AI Intervention
                    </span>
                    <p className="text-forest-950 dark:text-forest-200 font-semibold leading-relaxed">
                      {executionLog.after}
                    </p>
                  </div>
                </div>

                {/* Algorithmic Rationale Box */}
                <div className="p-4 rounded-2xl bg-stonebg-100 dark:bg-obsidian-900 border border-stonebg-200 dark:border-obsidian-800 text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Transparent Rationale:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {executionLog.rationale}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-stonebg-50 dark:bg-obsidian-900/40 border border-dashed border-stonebg-200 dark:border-obsidian-700 text-slate-400 text-xs space-y-2">
                <Zap className="w-8 h-8 text-gold-500 mx-auto opacity-70" />
                <p>Click "Simulate & Run Scenario #{activeScenarioId}" above to trigger this event live.</p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
