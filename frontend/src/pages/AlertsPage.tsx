import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  ShieldCheck, 
  Radio, 
  MessageSquare,
  FileCheck2
} from 'lucide-react';
import { apiService } from '../services/api';
import { AlertRecord, AlertStatus, SeverityLevel } from '../types';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Alert Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('WARNING');
  const [newMessage, setNewMessage] = useState('');
  const [newVillages, setNewVillages] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await apiService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: AlertStatus) => {
    try {
      await apiService.updateAlertStatus(id, status);
      await loadAlerts();
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    try {
      await apiService.createAlert({
        title: newTitle,
        severity: newSeverity,
        study_area: 'Tawa River Basin',
        scenario_name: 'Scenario A (Overtopping PMF)',
        message: newMessage,
        affected_villages: newVillages.split(',').map(v => v.trim()).filter(Boolean),
        status: 'DRAFT',
        delivery_status: 'Pending Dispatch'
      });
      setIsModalOpen(false);
      setNewTitle('');
      setNewMessage('');
      setNewVillages('');
      await loadAlerts();
    } catch (err) {
      console.error('Failed to create alert:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Public Warnings & Authority Alert Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Governed incident escalation workflow: DRAFT → REVIEW → APPROVED → DISPATCHED.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs shadow-md shadow-cyan-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Draft New Warning</span>
        </button>
      </div>

      {/* Protocol Banner */}
      <div className="bg-[#122238] border-l-4 border-cyan-400 p-4 rounded-r-xl border-y border-r border-slate-800 text-xs text-slate-300">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Verification & Authorization Protocol</strong>
            <span>
              Simulated notifications require two-officer authorization before external delivery simulation. Warnings clearly distinguish <em>hydrodynamic model alerts</em> from non-verified alarms.
            </span>
          </div>
        </div>
      </div>

      {/* Alerts Workflow List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-[#122238] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  alert.severity === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-sky-950 text-sky-400 border border-sky-800'
                }`}>
                  {alert.severity}
                </span>
                <h3 className="text-base font-bold text-white">{alert.title}</h3>
                <span className="text-xs font-mono text-slate-500">[{alert.id}]</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                  alert.status === 'SENT' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  alert.status === 'APPROVED' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                  alert.status === 'REVIEW' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-[#08111F] p-3 rounded-lg border border-slate-800 font-mono">
              "{alert.message}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2">
              <div className="space-x-4 text-slate-400 text-[11px]">
                <span><strong>Target Basin:</strong> {alert.study_area}</span>
                <span><strong>Villages:</strong> {alert.affected_villages.join(', ')}</span>
                <span><strong>Delivery Adapter:</strong> {alert.delivery_status}</span>
              </div>

              {/* Action Buttons based on state */}
              <div className="flex items-center gap-2">
                {alert.status === 'DRAFT' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'REVIEW')}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs transition"
                  >
                    Submit for Review
                  </button>
                )}

                {alert.status === 'REVIEW' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'APPROVED')}
                    className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs transition"
                  >
                    Approve Alert
                  </button>
                )}

                {alert.status === 'APPROVED' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'SENT')}
                    className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-xs flex items-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Simulate Public Dispatch</span>
                  </button>
                )}

                {alert.status === 'SENT' && (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Dispatched in Demonstration Mode</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for New Alert */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#122238] border border-cyan-500/50 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Draft Emergency Warning Advisory</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Advisory Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Catastrophic Breach Flash Inundation Warning"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Severity Rating</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="CRITICAL">CRITICAL (Immediate Life Threat)</option>
                  <option value="WARNING">WARNING (Elevated Inundation Hazard)</option>
                  <option value="ADVISORY">ADVISORY (Precautionary)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Target Settlements / Wards (comma separated)</label>
                <input
                  type="text"
                  placeholder="Rampur Khurd, Pipariya Downstream, Sangam Nagar"
                  value={newVillages}
                  onChange={(e) => setNewVillages(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Operational Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Include estimated flood arrival time, maximum anticipated water depth, and recommended evacuation corridors..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Draft Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
