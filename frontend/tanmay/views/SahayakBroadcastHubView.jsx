import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  Smartphone, 
  FileText, 
  Layers, 
  Clock, 
  Users, 
  Building, 
  ShieldCheck, 
  Volume2,
  Check,
  Flame,
  Radio
} from 'lucide-react';
import WhatsAppBroadcastCard from '../components/WhatsAppBroadcastCard';
import DiffCard from '../components/DiffCard';
import '../components/tanmay.css';

const SAMPLE_FACULTY_LIST = [
  { id: 'FAC_01', name: 'Dr. A. Verma', role: 'Professor & HOD, CS', avatar: '👨‍🏫', dept: 'CS' },
  { id: 'FAC_02', name: 'Prof. N. Gupta', role: 'Associate Prof, CS', avatar: '👨‍💼', dept: 'CS' },
  { id: 'FAC_05', name: 'Dr. S. Sharma', role: 'Professor & HOD, Physics', avatar: '🔬', dept: 'PHYS' },
  { id: 'FAC_09', name: 'Dr. M. Koul', role: 'Professor & HOD, Economics', avatar: '📊', dept: 'ECON' },
  { id: 'FAC_13', name: 'Dr. R. Dhar', role: 'Professor & HOD, English Lit', avatar: '📚', dept: 'LIT' }
];

const SAMPLE_STUDENT_COHORTS = [
  { id: 'COHORT_CS', name: 'Aarav Sharma', role: 'Student (CS Major + Econ Minor)', major: 'B.Sc. Computer Science', minor: 'Macroeconomics', avatar: '🎓' },
  { id: 'COHORT_PHYS', name: 'Mehak Jan', role: 'Student (Physics Major + CS Minor)', major: 'B.Sc. Physics', minor: 'Data Literacy', avatar: '👩‍🎓' },
  { id: 'COHORT_ECON', name: 'Zahid Lone', role: 'Student (Economics Major + CS Minor)', major: 'B.A. Economics', minor: 'Data Literacy', avatar: '👨‍🎓' },
  { id: 'COHORT_LIT', name: 'Ananya Bhat', role: 'Student (English Lit + Econ Minor)', major: 'B.A. English Literature', minor: 'Macroeconomics', avatar: '👩‍🎓' }
];

export default function SahayakBroadcastHubView({ simulationControls, onTimetableUpdated }) {
  const [inputText, setInputText] = useState('Dr. A. Verma is on leave this Thursday. Please adjust CS101 lab to Lab CS-2 without creating student clashes and broadcast updated schedule to faculty and students.');
  const [isRecording, setIsRecording] = useState(false);
  const [activeAudience, setActiveAudience] = useState('faculty'); // 'faculty' | 'student' | 'circular'
  const [selectedFacultyId, setSelectedFacultyId] = useState('FAC_01');
  const [selectedStudentId, setSelectedStudentId] = useState('COHORT_CS');
  const [isBroadcastingAll, setIsBroadcastingAll] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  const { runSimulation, simulationResult, isSimulating, applySimulation } = simulationControls || {};

  const handlePromptPreset = (presetText) => {
    setInputText(presetText);
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Dr. S. Sharma is unavailable on Friday Period 8. Re-route Physics practicals to alternate slot.');
      }, 2600);
    } else {
      setIsRecording(false);
    }
  };

  const handleSahayakSolve = async () => {
    if (!runSimulation) return;
    try {
      // Determine parameters from prompt
      const isRoom = inputText.toLowerCase().includes('lab') || inputText.toLowerCase().includes('room');
      const payload = isRoom ? {
        disruptionType: 'ROOM_CLOSURE',
        targetId: 'LAB_CS1',
        day: 'Wed',
        reason: 'HOD Emergency Directive via Sahayak AI'
      } : {
        disruptionType: 'FACULTY_LEAVE',
        targetId: 'FAC_01',
        day: 'Thu',
        reason: 'HOD Leave Intimation via Sahayak AI'
      };

      await runSimulation(payload);
    } catch (err) {
      console.error('Sahayak simulation failed', err);
    }
  };

  const handleBulkBroadcast = () => {
    setIsBroadcastingAll(true);
    setBroadcastDone(false);
    setTimeout(() => {
      setIsBroadcastingAll(false);
      setBroadcastDone(true);
      setTimeout(() => setBroadcastDone(false), 5000);
    }, 1800);
  };

  const selectedFaculty = SAMPLE_FACULTY_LIST.find(f => f.id === selectedFacultyId) || SAMPLE_FACULTY_LIST[0];
  const selectedStudent = SAMPLE_STUDENT_COHORTS.find(s => s.id === selectedStudentId) || SAMPLE_STUDENT_COHORTS[0];

  const facultyMessageData = {
    courseName: 'C++ Data Structures Lab (CS101_LAB)',
    day: 'Thursday',
    timeLabel: '01:40 PM - 03:20 PM',
    roomNumber: 'Lab CS-2 (Computing Center)',
    category: 'Major'
  };

  const studentMessageData = {
    courseName: 'Macroeconomics for Public Policy (ECON_MIN_01)',
    day: 'Tuesday & Thursday',
    timeLabel: '11:00 AM - 11:50 AM',
    roomNumber: 'LH-101 (Academic Block A)',
    category: 'Minor'
  };

  return (
    <div className="tanmay-container">
      {/* Sahayak Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: '0 10px 25px -5px rgba(6, 95, 70, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: '#10b981', color: '#064e3b', fontWeight: 800 }}>
                <Flame size={13} /> Live Gov & Mobile Dispatch
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                Sahayak AI Co-Pilot
              </span>
            </div>
            <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.4rem' }}>
              📱 Sahayak AI Voice Assistant + WhatsApp Broadcast Hub
            </h2>
            <p style={{ color: '#a7f3d0', fontSize: '0.88rem', margin: '4px 0 0 0', maxWidth: '780px' }}>
              HOD speaks or types emergency adjustments $\rightarrow$ MCV Engine resolves clashes $\rightarrow$ One-click simulated WhatsApp broadcast dispatches personalized schedules to 18 faculty & 210 students.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
                fontWeight: 700
              }}
              onClick={handleBulkBroadcast}
              disabled={isBroadcastingAll}
            >
              <Share2 size={16} />
              <span>{isBroadcastingAll ? 'Broadcasting to 228 Mobiles...' : '🚀 Broadcast All Schedules (WhatsApp)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Success Toast */}
      {broadcastDone && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          color: '#15803d',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <CheckCircle2 size={22} color="#22c55e" />
          <span>✅ WhatsApp Dispatch Delivered: 18/18 Faculty members & 210/210 NEP 2020 Students received individualized routines with 0 clashes!</span>
        </div>
      )}

      {/* Sahayak Natural Language & Voice Prompting Console */}
      <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: '#ecfdf5',
              color: '#059669',
              padding: '6px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>HOD Natural Language & Voice Dispatcher</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Speak in Hindi/English or type any timetable modification request
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={`btn ${isRecording ? 'btn-primary' : 'btn-outline'}`}
              style={{
                background: isRecording ? '#dc2626' : undefined,
                color: isRecording ? '#ffffff' : undefined,
                borderColor: isRecording ? '#dc2626' : undefined,
                padding: '8px 14px',
                fontSize: '0.84rem'
              }}
              onClick={handleVoiceToggle}
            >
              {isRecording ? (
                <>
                  <Radio size={16} className="spin" />
                  <span>Listening (Recording...)...</span>
                </>
              ) : (
                <>
                  <Mic size={16} color="#059669" />
                  <span>🎙️ Simulate HOD Voice Note</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <textarea
            className="form-input"
            rows="3"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your emergency timetable directive or HOD instruction..."
            style={{
              width: '100%',
              resize: 'vertical',
              padding: '12px 14px',
              fontSize: '0.92rem',
              lineHeight: 1.5,
              borderColor: isRecording ? '#22c55e' : undefined
            }}
          />
        </div>

        {/* Quick Demo Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick Prompts:
          </span>
          <button
            className="badge"
            style={{ background: '#f1f5f9', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
            onClick={() => handlePromptPreset('Dr. A. Verma is on leave this Thursday. Please adjust CS101 lab to Lab CS-2 without creating student clashes.')}
          >
            👨‍🏫 Dr. Verma Leave (Thursday)
          </button>
          <button
            className="badge"
            style={{ background: '#f1f5f9', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
            onClick={() => handlePromptPreset('Lab CS-1 is closed for electrical repair on Wednesday. Move C++ Lab to Computer Lab 2.')}
          >
            🏢 Lab CS-1 Repair (Wednesday)
          </button>
          <button
            className="badge"
            style={{ background: '#f1f5f9', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
            onClick={() => handlePromptPreset('Main Auditorium reserved for District Youth Convention on Friday Period 5-6. Move Yoga VAC.')}
          >
            🏛️ Auditorium Youth Fest (Friday)
          </button>
        </div>

        {/* Solver Action Trigger */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}
            onClick={handleSahayakSolve}
            disabled={isSimulating}
          >
            <Sparkles size={16} />
            <span>{isSimulating ? 'Sahayak AI Solving Constraints...' : '⚡ Sahayak AI Auto-Solve & Re-Route'}</span>
          </button>
        </div>
      </div>

      {/* Relocation Diff Preview if Simulation is Active */}
      {simulationResult && (
        <div className="card" style={{ border: '2px solid #10b981', background: '#fcfdfd' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge" style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
                <ShieldCheck size={13} /> Sahayak Re-Route Resolved
              </span>
              <h4 style={{ margin: 0 }}>Targeted Relocation Diff</h4>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
              0 Invariant Violations • Ready for WhatsApp Broadcast
            </span>
          </div>

          <div className="diff-card-grid">
            {simulationResult.diffs?.map((diff, index) => (
              <DiffCard key={index} diff={diff} />
            ))}
          </div>
        </div>
      )}

      {/* Live Interactive WhatsApp Broadcast Mockup Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={20} color="#128c7e" />
              <h3 style={{ margin: 0 }}>Interactive WhatsApp Dispatch Inspector</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: '2px 0 0 0' }}>
              Inspect how personalized notifications will render on faculty and student mobile screens before triggering live broadcast.
            </p>
          </div>

          {/* Audience Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`btn ${activeAudience === 'faculty' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                background: activeAudience === 'faculty' ? '#075e54' : undefined
              }}
              onClick={() => setActiveAudience('faculty')}
            >
              <Users size={14} />
              <span>Faculty Dispatch (18)</span>
            </button>

            <button
              className={`btn ${activeAudience === 'student' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                background: activeAudience === 'student' ? '#075e54' : undefined
              }}
              onClick={() => setActiveAudience('student')}
            >
              <Smartphone size={14} />
              <span>Student Dispatch (210)</span>
            </button>

            <button
              className={`btn ${activeAudience === 'circular' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                background: activeAudience === 'circular' ? '#075e54' : undefined
              }}
              onClick={() => setActiveAudience('circular')}
            >
              <FileText size={14} />
              <span>Official Gov Circular</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '28px', alignItems: 'flex-start' }}>
          {/* Left Column: Selector & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeAudience === 'faculty' && (
              <div className="form-group">
                <label className="form-label">Select Professor to Inspect:</label>
                <select
                  className="form-select"
                  value={selectedFacultyId}
                  onChange={(e) => setSelectedFacultyId(e.target.value)}
                >
                  {SAMPLE_FACULTY_LIST.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeAudience === 'student' && (
              <div className="form-group">
                <label className="form-label">Select Student Cohort to Inspect:</label>
                <select
                  className="form-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {SAMPLE_STUDENT_COHORTS.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.name} — {stu.major}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Dispatch Meta Info Card */}
            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.84rem'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span>NEP 2020 Dispatch Verification</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Target Channel: </span>
                <strong>WhatsApp Business API / J&K e-Samarth Gateway</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Encryption: </span>
                <strong>End-to-End 256-bit AES</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Conflict Audit: </span>
                <strong style={{ color: '#16a34a' }}>0 Overlapping Slots (Passed)</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Card Preview */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {activeAudience === 'faculty' && (
              <WhatsAppBroadcastCard
                recipient={selectedFaculty}
                messageData={facultyMessageData}
                type="faculty"
              />
            )}

            {activeAudience === 'student' && (
              <WhatsAppBroadcastCard
                recipient={selectedStudent}
                messageData={studentMessageData}
                type="student"
              />
            )}

            {activeAudience === 'circular' && (
              /* Official Circular Print Preview */
              <div style={{
                width: '100%',
                maxWidth: '520px',
                background: '#ffffff',
                border: '2px solid #0f172a',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
                fontFamily: '"Times New Roman", Times, serif',
                color: '#0f172a'
              }}>
                <div style={{ textAlign: 'center', borderBottom: '2px double #0f172a', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Government of Jammu & Kashmir
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>
                    OFFICE OF THE PRINCIPAL, GOVT. DEGREE COLLEGE
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                    Department of Higher Education • Civil Secretariat, Srinagar / Jammu
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '14px' }}>
                  <span><strong>Ref No:</strong> GDC/NEP2020/TT/2026/892</span>
                  <span><strong>Dated:</strong> 18-Aug-2026</span>
                </div>

                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.95rem', textDecoration: 'underline', marginBottom: '12px' }}>
                  NOTIFICATION: ACADEMIC TIMETABLE (SEMESTER 1 - NEP 2020)
                </div>

                <p style={{ fontSize: '0.84rem', lineHeight: 1.6, textAlign: 'justify', margin: '0 0 10px 0' }}>
                  It is hereby notified for the information of all Heads of Departments, Faculty Members, and Semester 1 Under-Graduate students that the AI-optimized multidisciplinary master schedule has been finalized in compliance with the UGC CCFUP Guidelines.
                </p>

                <p style={{ fontSize: '0.84rem', lineHeight: 1.6, textAlign: 'justify', margin: '0 0 14px 0' }}>
                  All Minor, MDC, SEC, AEC, and VAC elective slots have been synchronized into collision-free time bands. Individualized mobile timetables are accessible via WhatsApp and Student Portal.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>
                    <em>Generated via SmartSchedule NEP 2020 AI Engine</em>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>Principal / Dean Academics</div>
                    <div style={{ fontSize: '0.78rem' }}>Govt Degree College, J&K</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
