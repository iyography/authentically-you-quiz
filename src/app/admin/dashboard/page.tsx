"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Users, Calendar, TrendingUp, Download, Eye, ChevronDown, ChevronUp, LogOut, RefreshCw } from "lucide-react";
import * as XLSX from 'xlsx';

interface QuizResult {
  id: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
  answers: Record<number, string[]>;
  results: {
    zone: string;
    headline: string;
    description: string;
    patterns: string[];
    support: string;
  };
  styleInsights: string[];
  score: number;
  percentage: number;
}

interface Stats {
  totalResponses: number;
  zones: Record<string, number>;
  averageScore: number;
  responsesByDate: Record<string, number>;
}

export default function AdminDashboard() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'zone'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv' | 'json'>('xlsx');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [resultsResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/quiz-results'),
        fetch('/api/admin/quiz-results?stats=true')
      ]);

      if (resultsResponse.ok && statsResponse.ok) {
        const resultsData = await resultsResponse.json();
        const statsData = await statsResponse.json();
        setResults(resultsData);
        setStats(statsData);
      } else {
        sessionStorage.removeItem("adminAuth");
        router.push("/admin/login");
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const filteredAndSortedResults = results
    .filter(result => zoneFilter === 'all' || result.results.zone === zoneFilter)
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.timestamp);
          bVal = new Date(b.timestamp);
          break;
        case 'score':
          aVal = a.score;
          bVal = b.score;
          break;
        case 'zone':
          aVal = a.results.zone;
          bVal = b.results.zone;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

  const exportData = () => {
    const data = filteredAndSortedResults.map(result => {
      // Extract user inputs from answers
      const userInputs: Record<string, string> = {};
      Object.entries(result.answers).forEach(([questionId, answers]) => {
        userInputs[`Question ${questionId}`] = answers.join(', ');
      });

      return {
        'Response ID': result.id,
        'Date & Time': new Date(result.timestamp).toLocaleString(),
        'Confidence Zone': result.results.zone,
        'Score': result.score,
        'Percentage': `${result.percentage.toFixed(1)}%`,
        'Headline': result.results.headline,
        'Description': result.results.description,
        'Support Needed': result.results.support,
        'Style Insights': result.styleInsights.join('; '),
        'Patterns Identified': result.results.patterns.join('; '),
        'IP Address': result.ip || 'Unknown',
        'User Agent': result.userAgent,
        ...userInputs
      };
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const baseFileName = `authentically-you-quiz-results-${timestamp}`;

    if (exportFormat === 'xlsx') {
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Summary sheet
      const summaryData = [
        ['Total Responses', stats?.totalResponses || 0],
        ['Average Score', (stats?.averageScore || 0).toFixed(1)],
        [''],
        ['Zone Distribution'],
        ...Object.entries(stats?.zones || {}).map(([zone, count]) => [zone, count])
      ];
      
      const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
      
      // Detailed results sheet
      const detailsWS = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, detailsWS, 'Quiz Results');
      
      XLSX.writeFile(wb, `${baseFileName}.xlsx`);
    } else if (exportFormat === 'csv') {
      // Create CSV content
      const csv = [
        Object.keys(data[0] || {}).join(','),
        ...data.map(row => 
          Object.values(row).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          ).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${baseFileName}.csv`;
      link.click();
    } else if (exportFormat === 'json') {
      // Create JSON export with summary data
      const jsonExport = {
        exportDate: new Date().toISOString(),
        summary: {
          totalResponses: stats?.totalResponses || 0,
          averageScore: (stats?.averageScore || 0).toFixed(1),
          zoneDistribution: stats?.zones || {},
          responsesByDate: stats?.responsesByDate || {}
        },
        results: filteredAndSortedResults
      };
      
      const blob = new Blob([JSON.stringify(jsonExport, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${baseFileName}.json`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF8F0] to-[#F8F3E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#C9A86C] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="font-sans text-[#6B6B6B]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF8F0] to-[#F8F3E8] text-[#3D3D3D]">
      {/* Header */}
      <header className="border-b border-[#3D3D3D]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#C9A86C] rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl text-[#3D3D3D]">Admin Dashboard</h1>
                <p className="font-sans text-sm text-[#6B6B6B]">Authentically You Quiz Results</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-sm text-[#6B6B6B] hover:text-[#3D3D3D] hover:bg-white/50 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-sm text-[#6B6B6B] hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 rounded-2xl p-6 border border-[#3D3D3D]/10 soft-glow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#C9A86C]/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#C9A86C]" />
              </div>
              <div>
                <p className="font-sans text-sm text-[#6B6B6B]">Total Responses</p>
                <p className="font-serif text-3xl text-[#3D3D3D]">{stats?.totalResponses || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 rounded-2xl p-6 border border-[#3D3D3D]/10 soft-glow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#B4D4E3]/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#4A90B8]" />
              </div>
              <div>
                <p className="font-sans text-sm text-[#6B6B6B]">Average Score</p>
                <p className="font-serif text-3xl text-[#3D3D3D]">{(stats?.averageScore || 0).toFixed(1)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 rounded-2xl p-6 border border-[#3D3D3D]/10 soft-glow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#C5B4E3]/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#8B5A9F]" />
              </div>
              <div>
                <p className="font-sans text-sm text-[#6B6B6B]">Active Days</p>
                <p className="font-serif text-3xl text-[#3D3D3D]">{Object.keys(stats?.responsesByDate || {}).length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 rounded-2xl p-6 border border-[#3D3D3D]/10 soft-glow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E3B4D4]/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#D67BA8]" />
              </div>
              <div>
                <p className="font-sans text-sm text-[#6B6B6B]">Top Zone</p>
                <p className="font-serif text-lg text-[#3D3D3D]">
                  {stats && Object.keys(stats.zones).length > 0
                    ? Object.entries(stats.zones).reduce((a, b) => stats.zones[a[0]] > stats.zones[b[0]] ? a : b)[0]
                    : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Zone Distribution */}
        {stats && Object.keys(stats.zones).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 rounded-2xl p-8 border border-[#3D3D3D]/10 soft-glow mb-8"
          >
            <h2 className="font-serif text-2xl text-[#3D3D3D] mb-6">Confidence Zone Distribution</h2>
            <div className="space-y-4">
              {Object.entries(stats.zones).map(([zone, count], index) => {
                const percentage = (count / stats.totalResponses) * 100;
                const colors = [
                  'from-[#C9A86C] to-[#b8975b]',
                  'from-[#B4D4E3] to-[#4A90B8]',
                  'from-[#C5B4E3] to-[#8B5A9F]',
                  'from-[#E3B4D4] to-[#D67BA8]',
                  'from-[#E8D5B5] to-[#C9A86C]'
                ];
                return (
                  <motion.div
                    key={zone}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-40 font-sans text-sm font-medium text-[#3D3D3D]">{zone}</div>
                    <div className="flex-1 bg-[#3D3D3D]/10 rounded-full h-8 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        className={`bg-gradient-to-r ${colors[index % colors.length]} h-full rounded-full`}
                      />
                      <div className="absolute inset-0 flex items-center px-4 text-sm font-sans font-semibold text-[#3D3D3D]">
                        {count} responses ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 rounded-2xl p-6 border border-[#3D3D3D]/10 soft-glow mb-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-medium text-[#3D3D3D]">Filter by zone:</span>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="font-sans text-sm border border-[#3D3D3D]/20 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A86C]/50"
              >
                <option value="all">All Zones</option>
                {stats && Object.keys(stats.zones).map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-medium text-[#3D3D3D]">Sort by:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="font-sans text-sm border border-[#3D3D3D]/20 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A86C]/50"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
                <option value="zone-asc">Zone A-Z</option>
                <option value="zone-desc">Zone Z-A</option>
              </select>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm font-medium text-[#3D3D3D]">Export as:</span>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="font-sans text-sm border border-[#3D3D3D]/20 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A86C]/50"
                >
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="json">JSON (.json)</option>
                </select>
              </div>
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-[#C9A86C] text-white px-6 py-2 rounded-xl hover:bg-[#b8975b] transition-all font-sans font-semibold soft-glow"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="font-serif text-2xl text-[#3D3D3D] mb-4">
            Quiz Results ({filteredAndSortedResults.length} of {results.length})
          </h2>
          
          {filteredAndSortedResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="bg-white/80 rounded-2xl border border-[#3D3D3D]/10 overflow-hidden soft-glow"
            >
              <div
                className="p-6 cursor-pointer hover:bg-white/50 transition-all"
                onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-4 h-4 bg-[#C9A86C] rounded-full"></div>
                        <h3 className="font-serif text-lg text-[#3D3D3D]">{result.results.zone}</h3>
                      </div>
                      <p className="font-sans text-sm text-[#6B6B6B]">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                      <p className="font-sans text-xs text-[#6B6B6B] mt-1">
                        ID: {result.id.slice(0, 8)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans font-semibold text-lg text-[#3D3D3D]">
                        {result.score}/{18 * 5}
                      </p>
                      <p className="font-sans text-sm text-[#6B6B6B]">
                        {result.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-[#6B6B6B]" />
                    {expandedResult === result.id ? (
                      <ChevronUp className="w-5 h-5 text-[#6B6B6B]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#6B6B6B]" />
                    )}
                  </div>
                </div>
              </div>

              {expandedResult === result.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#3D3D3D]/10 bg-gradient-to-r from-white/20 to-white/40"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Results */}
                      <div>
                        <h4 className="font-serif text-lg text-[#3D3D3D] mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#C9A86C] rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          Results Summary
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <p className="font-sans text-sm font-semibold text-[#3D3D3D] mb-1">Headline:</p>
                            <p className="font-sans text-sm text-[#6B6B6B]">{result.results.headline}</p>
                          </div>
                          <div>
                            <p className="font-sans text-sm font-semibold text-[#3D3D3D] mb-1">Description:</p>
                            <p className="font-sans text-sm text-[#6B6B6B]">{result.results.description}</p>
                          </div>
                          <div>
                            <p className="font-sans text-sm font-semibold text-[#3D3D3D] mb-2">Patterns:</p>
                            <div className="space-y-1">
                              {result.results.patterns.map((pattern, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-[#C9A86C] text-sm">•</span>
                                  <span className="font-sans text-sm text-[#6B6B6B]">{pattern}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-sans text-sm font-semibold text-[#3D3D3D] mb-1">Support Needed:</p>
                            <p className="font-sans text-sm text-[#6B6B6B]">{result.results.support}</p>
                          </div>
                        </div>
                      </div>

                      {/* User Inputs & Technical */}
                      <div>
                        <h4 className="font-serif text-lg text-[#3D3D3D] mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#B4D4E3] rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          Technical Details
                        </h4>
                        <div className="space-y-3 font-sans text-sm">
                          <div>
                            <span className="font-semibold text-[#3D3D3D]">Response ID:</span>
                            <code className="bg-[#3D3D3D]/10 px-2 py-1 rounded ml-2 text-xs">{result.id}</code>
                          </div>
                          <div>
                            <span className="font-semibold text-[#3D3D3D]">IP Address:</span>
                            <span className="ml-2 text-[#6B6B6B]">{result.ip || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#3D3D3D]">Questions Answered:</span>
                            <span className="ml-2 text-[#6B6B6B]">{Object.keys(result.answers).length}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#3D3D3D]">Browser:</span>
                            <span className="ml-2 text-[#6B6B6B] text-xs break-all">{result.userAgent}</span>
                          </div>
                        </div>

                        {result.styleInsights.length > 0 && (
                          <div className="mt-6">
                            <h5 className="font-serif text-md text-[#3D3D3D] mb-2 flex items-center gap-2">
                              <div className="w-5 h-5 bg-[#C5B4E3] rounded flex items-center justify-center">
                                <Eye className="w-3 h-3 text-white" />
                              </div>
                              Style Insights
                            </h5>
                            <div className="space-y-1">
                              {result.styleInsights.map((insight, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-[#C5B4E3] text-sm">•</span>
                                  <span className="font-sans text-sm text-[#6B6B6B]">{insight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show some user answers */}
                        <div className="mt-6">
                          <h5 className="font-serif text-md text-[#3D3D3D] mb-2">Sample Answers</h5>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {Object.entries(result.answers).slice(0, 3).map(([questionId, answers]) => (
                              <div key={questionId} className="text-sm">
                                <span className="font-semibold text-[#3D3D3D]">Q{questionId}:</span>
                                <span className="ml-2 text-[#6B6B6B]">{answers.join(', ')}</span>
                              </div>
                            ))}
                            {Object.keys(result.answers).length > 3 && (
                              <p className="text-xs text-[#6B6B6B] italic">
                                +{Object.keys(result.answers).length - 3} more answers
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
          
          {filteredAndSortedResults.length === 0 && (
            <div className="bg-white/80 rounded-2xl p-12 border border-[#3D3D3D]/10 text-center soft-glow">
              <div className="w-16 h-16 bg-[#3D3D3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-[#6B6B6B]" />
              </div>
              <p className="font-sans text-[#6B6B6B]">No results match your current filters.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}