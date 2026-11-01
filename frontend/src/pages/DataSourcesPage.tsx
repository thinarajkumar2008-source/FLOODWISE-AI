import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  FileCode, 
  HardDrive,
  Download,
  Info
} from 'lucide-react';
import { apiService } from '../services/api';
import { DatasetItem } from '../types';

export const DataSourcesPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload simulation form state
  const [datasetName, setDatasetName] = useState('');
  const [fileType, setFileType] = useState<'GeoJSON' | 'CSV' | 'GeoTIFF' | 'HEC-RAS HDF5'>('GeoJSON');
  const [sourceOrg, setSourceOrg] = useState('');
  const [crs, setCrs] = useState('EPSG:4326 - WGS 84');
  const [description, setDescription] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const data = await apiService.getDatasets();
      setDatasets(data);
    } catch (err) {
      console.error('Failed to load datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!datasetName.trim()) {
      setUploadError('Dataset filename or title is required.');
      return;
    }

    if (!datasetName.endsWith('.json') && !datasetName.endsWith('.geojson') && !datasetName.endsWith('.csv') && !datasetName.endsWith('.tif') && !datasetName.endsWith('.hdf')) {
      setUploadError('Invalid file extension. Supported extensions are .geojson, .json, .csv, .tif, .hdf.');
      return;
    }

    try {
      await apiService.addDataset({
        name: datasetName,
        file_type: fileType,
        source: sourceOrg || 'Field Hydrographic Survey',
        coordinate_system: crs,
        spatial_extent: 'Bounding Box [77.6E, 22.5N, 77.9E, 22.8N]',
        feature_count: Math.floor(Math.random() * 250) + 12,
        file_size_kb: Math.floor(Math.random() * 3200) + 240,
        validation_status: 'Validated',
        description: description || 'User-imported spatial dataset for dam break simulation boundary definition.'
      });

      setUploadSuccess(true);
      setDatasetName('');
      setDescription('');
      setSourceOrg('');
      await loadDatasets();
    } catch (err) {
      setUploadError('Failed to import dataset: ' + String(err));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Geospatial Datasets & Provenance Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ingest, validate, and inspect coordinate systems (CRS), elevation rasters, river vectors, and hydrodynamic mesh outputs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded">
            CRS Enforced: EPSG:4326 / EPSG:32643
          </span>
        </div>
      </div>

      {/* Upload & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form Card */}
        <div className="bg-[#122238] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Upload className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Import Geospatial Dataset</h3>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Dataset ingested and coordinate system verified!</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Dataset Filename</label>
              <input
                type="text"
                placeholder="e.g. Narmada_downstream_cross_sections.geojson"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Data Format</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="GeoJSON">GeoJSON (Vector Features & Contours)</option>
                <option value="CSV">CSV (HEC-RAS Observation Mesh / Cross-Sections)</option>
                <option value="GeoTIFF">GeoTIFF (Digital Elevation Model DEM)</option>
                <option value="HEC-RAS HDF5">HEC-RAS HDF5 Simulation Binary</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Coordinate Reference System (CRS)</label>
              <select
                value={crs}
                onChange={(e) => setCrs(e.target.value)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="EPSG:4326 - WGS 84">EPSG:4326 - WGS 84 Geographic</option>
                <option value="EPSG:32643 - UTM Zone 43N">EPSG:32643 - UTM Zone 43N Projected</option>
                <option value="EPSG:32644 - UTM Zone 44N">EPSG:32644 - UTM Zone 44N Projected</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Data Source / Organization</label>
              <input
                type="text"
                placeholder="e.g. Central Water Commission / CartoDEM"
                value={sourceOrg}
                onChange={(e) => setSourceOrg(e.target.value)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Description & Metadata</label>
              <textarea
                rows={2}
                placeholder="Notes on resolution, horizontal accuracy, or cross-section spacing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#08111F] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-cyan-500/20 transition flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Validate & Ingest File</span>
            </button>
          </form>
        </div>

        {/* Datasets Table */}
        <div className="lg:col-span-2 bg-[#122238] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-sm font-semibold text-white">Registered Hydrodynamic Datasets</h3>
              <span className="text-xs text-slate-400">{datasets.length} files cataloged</span>
            </div>

            <div className="space-y-3">
              {datasets.map((d) => (
                <div
                  key={d.id}
                  className="bg-[#08111F] border border-slate-800 rounded-lg p-3 text-xs space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{d.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {d.file_type}
                      </span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {d.validation_status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px]">{d.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <div>
                      <span className="block text-slate-500">CRS:</span>
                      <span className="text-slate-300 font-mono truncate">{d.coordinate_system}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Features:</span>
                      <span className="text-slate-300 font-mono">{d.feature_count} entities</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Size:</span>
                      <span className="text-slate-300 font-mono">{d.file_size_kb} KB</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Source:</span>
                      <span className="text-slate-300 truncate">{d.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Storage: Safe sandboxed disk storage path `data/demo/`</span>
            <span className="text-cyan-400">Strict extension checking enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
