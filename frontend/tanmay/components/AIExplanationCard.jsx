import React from 'react';
import { Sparkles, Lightbulb, CheckCircle, Info } from 'lucide-react';
import './tanmay.css';

export default function AIExplanationCard({
  aiSummary = "Optimal NEP 2020 schedule generated with 0 hard clashes. All 4 Major cohort core subjects, 4 Minor electives, and practical laboratory blocks have been allocated into collision-free synchronized time bands with 94/100 quality score.",
  recommendations = [
    "Computer Lab 1 has 88% peak load between 11:00 AM - 01:00 PM; balanced by moving SEC Web Lab to Thursday.",
    "Faculty teaching load has a standard deviation of 1.2 hours/day, ensuring balanced workload distribution.",
    "0 student elective basket collisions detected across CS, Physics, Economics, and Literature cohorts."
  ]
}) {
  return (
    <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
          color: 'white',
          padding: '6px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={18} />
        </div>
        <div>
          <h3>Explainable AI Co-Pilot Diagnostic Briefing</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            Automated combinatorial reasoning and institutional policy recommendations.
          </p>
        </div>
      </div>

      {/* Natural Language Executive Summary */}
      <div className="ai-summary-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Info size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#065f46', fontSize: '0.92rem', marginBottom: '4px' }}>Executive Summary</h4>
            <p style={{ color: '#047857', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {aiSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Policy Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={16} color="#eab308" />
            <span>Optimization & Infrastructure Insights ({recommendations.length})</span>
          </h4>

          <div className="ai-recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="ai-recommendation-item">
                <CheckCircle size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ lineHeight: 1.5 }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
