import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function AIExplanation({ darkMode, result, inputs }) {
  if (!result || !inputs) return null;

  // Determine value level based on predicted spend
  let valueLevel, badgeColor, badgeIcon, badgeBg;

  if (result.predicted_spend >= 600) {
    valueLevel = 'HIGH VALUE';
    badgeColor = 'text-emerald-400';
    badgeBg = darkMode
      ? 'bg-emerald-500/10 border-emerald-500/30'
      : 'bg-emerald-50 border-emerald-200';
    badgeIcon = <ArrowUpRight size={20} className="text-emerald-400" />;
  } else if (result.predicted_spend < 450) {
    valueLevel = 'LOW VALUE';
    badgeColor = 'text-red-400';
    badgeBg = darkMode
      ? 'bg-red-500/10 border-red-500/30'
      : 'bg-red-50 border-red-200';
    badgeIcon = <ArrowDownRight size={20} className="text-red-400" />;
  } else {
    valueLevel = 'MEDIUM VALUE';
    badgeColor = 'text-amber-400';
    badgeBg = darkMode
      ? 'bg-amber-500/10 border-amber-500/30'
      : 'bg-amber-50 border-amber-200';
    badgeIcon = <Minus size={20} className="text-amber-400" />;
  }

  // Generate simple-language bullet points using ACTUAL input values and TRUE mathematical coefficients
  const bullets = [];

  // Membership (Coef: $61.67, Mean: 3.53)
  const membershipCoef = 61.67;
  const membershipMean = 3.53;
  const membershipContribution = inputs.length_of_membership * membershipCoef;
  
  if (inputs.length_of_membership > membershipMean) {
    bullets.push({
      text: `Membership loyalty is outstanding at ${inputs.length_of_membership.toFixed(1)} years (above the 3.5-year average). This stable tenure contributes a massive $${membershipContribution.toFixed(2)} directly to their annual spending forecast, proving customer loyalty is the primary business driver.`,
      sentiment: 'positive',
    });
  } else {
    bullets.push({
      text: `With a membership duration of ${inputs.length_of_membership.toFixed(1)} years (below the 3.5-year average), this relatively newer customer is still building platform loyalty, contributing $${membershipContribution.toFixed(2)} to their spending forecast.`,
      sentiment: 'neutral',
    });
  }

  // App Usage (Coef: $38.60, Mean: 12.05)
  const appCoef = 38.60;
  const appMean = 12.05;
  const appContribution = inputs.time_on_app * appCoef;
  
  if (inputs.time_on_app > appMean) {
    bullets.push({
      text: `Mobile app engagement is exceptionally strong at ${inputs.time_on_app.toFixed(1)} minutes per session (above the 12.1-minute average). This high mobile activity contributes $${appContribution.toFixed(2)} to their predicted yearly spending.`,
      sentiment: 'positive',
    });
  } else {
    bullets.push({
      text: `Mobile app time is moderate at ${inputs.time_on_app.toFixed(1)} minutes per session (below the 12.1-minute average), contributing $${appContribution.toFixed(2)} to their predicted annual spend. Increasing app time yields a massive $38.60 return per minute!`,
      sentiment: 'negative',
    });
  }

  // Session Length (Coef: $25.72, Mean: 33.05)
  const sessionCoef = 25.72;
  const sessionMean = 33.05;
  const sessionContribution = inputs.avg_session_length * sessionCoef;
  
  if (inputs.avg_session_length > sessionMean) {
    bullets.push({
      text: `Browsing session duration averages a healthy ${inputs.avg_session_length.toFixed(1)} minutes (above the 33.1-minute average). This deep browsing behavior adds $${sessionContribution.toFixed(2)} to their annual spending predictions.`,
      sentiment: 'positive',
    });
  } else {
    bullets.push({
      text: `Session browsing length is shorter at ${inputs.avg_session_length.toFixed(1)} minutes (below the 33.1-minute average), adding $${sessionContribution.toFixed(2)} to their prediction. Shorter browsing sessions historically reduce immediate checkout volumes.`,
      sentiment: 'neutral',
    });
  }

  // Website Time (Coef: $0.46, Mean: 37.06)
  const webCoef = 0.46;
  const webContribution = inputs.time_on_website * webCoef;
  
  bullets.push({
    text: `Website time of ${inputs.time_on_website.toFixed(1)} minutes contributes a negligible $${webContribution.toFixed(2)} (due to a near-zero coefficient of $0.46). This mathematically proves that web-based marketing has virtually NO effect on customer spending compared to mobile app engagement.`,
    sentiment: 'neutral',
  });

  const sentimentDot = {
    positive: 'bg-emerald-500',
    negative: 'bg-red-500',
    neutral: 'bg-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
      className="w-full mt-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
          <BrainCircuit size={20} className="text-white" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Explanation
          </h3>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Plain-language breakdown · No ML jargon · Based on your actual inputs
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode
          ? 'bg-slate-900/70 border-slate-700/40'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row">
          {/* Reasons Column */}
          <div className="flex-1 p-6">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
              darkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <Sparkles size={14} />
              Key Reasons
            </h4>

            <div className="space-y-3">
              {bullets.map((bullet, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    darkMode ? 'bg-slate-800/50' : 'bg-gray-50'
                  }`}
                >
                  <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${sentimentDot[bullet.sentiment]}`} />
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    {bullet.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className={`mt-5 p-4 rounded-xl border ${
              darkMode
                ? 'bg-slate-800/30 border-slate-700/40'
                : 'bg-gray-50 border-gray-100'
            }`}>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <strong className={darkMode ? 'text-white' : 'text-gray-900'}>Bottom Line:</strong>{' '}
                Based on this customer's engagement patterns, the model predicts they will spend{' '}
                <strong className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
                  ${result.predicted_spend?.toFixed(2)}
                </strong>{' '}
                per year. {result.predicted_spend >= 600
                  ? 'This is a high-value customer worth investing in.'
                  : result.predicted_spend < 450
                    ? 'There\'s room to grow — improving app engagement could boost their spending.'
                    : 'They\'re a solid mid-tier customer with potential for growth.'}
              </p>
            </div>
          </div>

          {/* Verdict Column */}
          <div className={`lg:w-56 flex flex-col items-center justify-center p-8 border-t lg:border-t-0 lg:border-l ${
            darkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-gray-100 bg-gray-50/50'
          }`}>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${
              darkMode ? 'text-slate-500' : 'text-gray-400'
            }`}>
              Final Verdict
            </span>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className={`flex flex-col items-center gap-3 px-6 py-5 rounded-2xl border-2 ${badgeBg}`}
            >
              {badgeIcon}
              <span className={`text-lg font-black tracking-wide ${badgeColor}`}>
                {valueLevel}
              </span>
            </motion.div>

            <div className={`mt-5 text-center text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
              <p>Predicted Spend</p>
              <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${result.predicted_spend?.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
