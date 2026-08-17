import React, { useState } from 'react';
import { Layers, Info, Filter, Sparkles, ShieldCheck, BookOpen } from 'lucide-react';
import BasketCard from '../components/BasketCard';
import '../components/tanmay.css';

const SAMPLE_BASKETS = [
  {
    id: 'BASKET_MINOR_1',
    basketName: 'NEP Synchronized Minor Basket (Band A)',
    category: 'Minor',
    timeBand: 'Tuesday & Thursday • Period 3 (11:00 AM)',
    credits: 4,
    description: 'Cross-departmental multidisciplinary minor electives synchronized to execute in parallel across all 4 departments.',
    courses: [
      { id: 'CS_MIN_01', code: 'CS-M101', name: 'Computational Thinking & Data Literacy', departmentCode: 'CS' },
      { id: 'PHYS_MIN_01', code: 'PHYS-M101', name: 'Everyday Physics & Green Energy', departmentCode: 'PHYS' },
      { id: 'ECON_MIN_01', code: 'ECON-M101', name: 'Macroeconomics for Public Policy', departmentCode: 'ECON' },
      { id: 'LIT_MIN_01', code: 'LIT-M101', name: 'Creative Writing & Modern Discourse', departmentCode: 'LIT' }
    ]
  },
  {
    id: 'BASKET_MDC_1',
    basketName: 'Multidisciplinary Exploratory Basket (MDC 1)',
    category: 'MDC',
    timeBand: 'Wednesday & Friday • Period 2 (09:50 AM)',
    credits: 3,
    description: 'Interdisciplinary courses taken outside student home faculty to foster broad intellectual foundation.',
    courses: [
      { id: 'MDC_ASTRO', code: 'MDC-101', name: 'Introductory Astronomy & Space Science', departmentCode: 'PHYS' },
      { id: 'MDC_ENV', code: 'MDC-102', name: 'Himalayan Ecology & Climate Action', departmentCode: 'PHYS' },
      { id: 'MDC_FIN', code: 'MDC-103', name: 'Personal Finance & Investment Markets', departmentCode: 'ECON' },
      { id: 'MDC_MEDIA', code: 'MDC-104', name: 'Digital Media & Society', departmentCode: 'LIT' }
    ]
  },
  {
    id: 'BASKET_SEC_1',
    basketName: 'Skill Enhancement Practical Lab Band (SEC)',
    category: 'SEC',
    timeBand: 'Mon / Wed / Thu • Period 5-6 (01:40 PM - 03:20 PM Continuous Block)',
    credits: 2,
    description: 'Continuous 2-period atomic laboratory sessions scheduled without interrupting morning theory tracks.',
    courses: [
      { id: 'SEC_WEB', code: 'SEC-101', name: 'Web Design & Modern UI Lab', departmentCode: 'CS' },
      { id: 'SEC_DATA', code: 'SEC-102', name: 'Python for Data Analytics Lab', departmentCode: 'CS' },
      { id: 'SEC_SCI', code: 'SEC-103', name: 'Scientific Instrumentation & Calibration', departmentCode: 'PHYS' }
    ]
  },
  {
    id: 'BASKET_AEC_1',
    basketName: 'Ability Enhancement & Languages Band (AEC)',
    category: 'AEC',
    timeBand: 'Monday • Period 3 & Thursday • Period 4',
    credits: 2,
    description: 'Language, critical communication, and regional literature modules shared across wide cohorts.',
    courses: [
      { id: 'AEC_COMM', code: 'AEC-101', name: 'Professional Communication in English', departmentCode: 'LIT' },
      { id: 'AEC_REG', code: 'AEC-102', name: 'Regional Languages: Kashmiri / Dogri Literature', departmentCode: 'LIT' }
    ]
  },
  {
    id: 'BASKET_VAC_1',
    basketName: 'Value-Added Institutional Band (VAC)',
    category: 'VAC',
    timeBand: 'Monday • Period 7 & Thursday • Period 5',
    credits: 2,
    description: 'Institutional ethics, wellness, digital citizenship, and environmental sustainability modules.',
    courses: [
      { id: 'VAC_ETHICS', code: 'VAC-101', name: 'Digital Ethics, Cyber Law & Privacy', departmentCode: 'CS' },
      { id: 'VAC_ENV', code: 'VAC-102', name: 'Environmental Sustainability Studies', departmentCode: 'PHYS' },
      { id: 'VAC_WELLNESS', code: 'VAC-103', name: 'Holistic Health, Yoga & Physical Fitness', departmentCode: 'LIT' }
    ]
  }
];

export default function BasketManagerView() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredBaskets = selectedCategory === 'ALL'
    ? SAMPLE_BASKETS
    : SAMPLE_BASKETS.filter(b => b.category.toUpperCase() === selectedCategory);

  return (
    <div className="tanmay-container">
      {/* Header Info Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Layers size={22} color="var(--primary-600)" />
              <h3 style={{ margin: 0 }}>NEP 2020 Course & Elective Basket Synchronizer</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '820px' }}>
              Under NEP 2020 UGC CCFUP, cross-cutting electives (Minor, MDC, SEC, AEC, VAC) are synchronized into universal time bands. This prevents combinatorial conflict across departments and guarantees that any student choice combination is mathematically feasible.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'MINOR', 'MDC', 'SEC', 'AEC', 'VAC'].map((cat) => (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Basket Cards */}
      <div className="basket-grid">
        {filteredBaskets.map((basket) => (
          <BasketCard
            key={basket.id}
            basketName={basket.basketName}
            category={basket.category}
            timeBand={basket.timeBand}
            credits={basket.credits}
            description={basket.description}
            courses={basket.courses}
          />
        ))}
      </div>
    </div>
  );
}
