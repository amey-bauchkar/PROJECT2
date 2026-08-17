import React, { useState } from 'react';
import { 
  CheckCheck, 
  Send, 
  Share2, 
  Copy, 
  Check, 
  Phone, 
  Video, 
  MoreVertical, 
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck
} from 'lucide-react';
import './tanmay.css';

export default function WhatsAppBroadcastCard({ recipient, messageData, type = 'faculty' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = type === 'faculty' 
      ? `🏛️ *GOVT DEGREE COLLEGE J&K - TIMETABLE ALERT*\nRespected ${recipient.name},\nYour schedule has been updated with 0 clashes.\n📅 Day: ${messageData.day}\n📍 Venue: ${messageData.roomNumber}\n⏰ Time: ${messageData.timeLabel}\n📖 Course: ${messageData.courseName}\n_SmartSchedule NEP 2020 AI Orchestrator_`
      : `🎓 *NEP 2020 STUDENT SCHEDULE ALERT*\nDear Student (${recipient.name}),\nYour personalized clash-free timetable is ready:\n📚 Major: ${recipient.major} | Minor: ${recipient.minor}\n📍 Next Session: ${messageData.courseName} at ${messageData.roomNumber} (${messageData.timeLabel})\n_Govt of Jammu & Kashmir Higher Education Portal_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '380px',
      background: '#efeae2',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
      border: '8px solid #1f2937',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* WhatsApp Header */}
      <div style={{
        background: '#075e54',
        color: '#ffffff',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: type === 'faculty' ? '#128c7e' : '#25d366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'white',
            border: '1.5px solid rgba(255,255,255,0.4)'
          }}>
            {recipient.avatar || (type === 'faculty' ? '👨‍🏫' : '🎓')}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
              {recipient.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
              <span>{recipient.role || (type === 'faculty' ? 'Professor • J&K HED' : 'Student • Year 1')}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', color: '#ffffff', opacity: 0.9 }}>
          <Phone size={16} />
          <Video size={16} />
          <MoreVertical size={16} />
        </div>
      </div>

      {/* WhatsApp Chat Body with Wallpaper */}
      <div style={{
        padding: '14px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '340px',
        backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0'
      }}>
        {/* Date Pill */}
        <div style={{ textAlign: 'center', margin: '4px 0' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '3px 10px',
            borderRadius: '8px',
            fontSize: '0.7rem',
            color: '#6b7280',
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            TODAY • OFFICIAL BROADCAST
          </span>
        </div>

        {/* Message Bubble */}
        <div style={{
          alignSelf: 'flex-start',
          background: '#ffffff',
          borderRadius: '0 12px 12px 12px',
          padding: '12px 14px',
          maxWidth: '92%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          position: 'relative',
          fontSize: '0.84rem',
          lineHeight: 1.45,
          color: '#111827'
        }}>
          {/* Header Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            paddingBottom: '8px',
            marginBottom: '8px',
            borderBottom: '1px solid #f3f4f6',
            color: '#075e54',
            fontWeight: 700,
            fontSize: '0.82rem'
          }}>
            <Building size={14} />
            <span>Govt Degree College, J&K</span>
          </div>

          <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#1f2937' }}>
            {type === 'faculty' 
              ? `Namaste ${recipient.name}, here is your verified clash-free NEP 2020 schedule:`
              : `Hello ${recipient.name}, your personalized NEP 2020 daily timetable has been published:`}
          </p>

          {/* Schedule Highlight Box */}
          <div style={{
            background: '#f0fdf4',
            borderLeft: '3px solid #22c55e',
            padding: '8px 10px',
            borderRadius: '4px',
            margin: '8px 0',
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} />
              <span>{messageData.courseName} ({messageData.category || 'Major'})</span>
            </div>
            <div style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>{messageData.day} • {messageData.timeLabel}</span>
            </div>
            <div style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} />
              <span>Venue: <strong>{messageData.roomNumber}</strong></span>
            </div>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#4b5563', margin: '6px 0 0 0' }}>
            ✅ <em>0 hard clashes detected. Verified by MCV AI Orchestrator.</em>
          </div>

          {/* Timestamp & Double Blue Ticks */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.68rem',
            color: '#6b7280',
            marginTop: '4px'
          }}>
            <span>10:30 AM</span>
            <CheckCheck size={14} color="#3b82f6" />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        background: '#f0f2f5',
        padding: '10px 14px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.76rem', color: '#6b7280', fontWeight: 600 }}>
          Live WhatsApp Dispatch Preview
        </span>

        <button
          className="btn btn-outline"
          style={{
            padding: '4px 10px',
            fontSize: '0.76rem',
            gap: '4px',
            background: '#ffffff',
            borderColor: '#d1d5db',
            color: '#374151'
          }}
          onClick={handleCopy}
        >
          {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy Msg'}</span>
        </button>
      </div>
    </div>
  );
}
