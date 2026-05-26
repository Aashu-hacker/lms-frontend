import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import {
  Box,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  Save,
  Visibility,
  Publish,
  ExitToApp,
  AddCircle,
  TextFields,
  Image as ImageIcon,
  TableChart,
  Delete,
  ContentCopy,
  ArrowUpward,
  ArrowDownward,
  DragIndicator,
  CloudUpload,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatAlignLeft,
  FormatAlignCenter
} from '@mui/icons-material';
import axios from 'axios';

import REACT_APP_BASE_URL from 'utils/api';

import Swal from 'sweetalert2';

export default function ReportWorkspaceStudio() {
  const { id, versionId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  // --- Core Application State Structure ---
  const [reportName, setReportName] = useState('Market Analytics Report');
  const [header, setHeader] = useState({
    title: 'Enterprise Technical Evaluation Report',
    subTitle: 'Production Performance Data Infrastructure Audit Framework Matrix',
    analystName: 'Alex Mercer (Lead Intelligence Architect)',
    date: new Date().toISOString().split('T')[0]
  });

  const [sections, setSections] = useState([
    {
      id: 'sec_1',
      title: 'Infrastructure Node Assessment Core Section',
      description: 'Primary computational evaluation telemetry criteria mapping framework guidelines.',
      elements: [
        {
          id: 'el_txt_1',
          type: 'text',
          x: 30,
          y: 30,
          w: 700,
          h: 150,
          zIndex: 1,
          textContent:
            'This system framework captures cross-functional system telemetry data matrices. Click here to use the active inline formatting tools.',
          imageAlignment: 'Left',
          isBold: false,
          isItalic: false,
          isBullet: false
        }
      ]
    }
  ]);
  const [footer, setFooter] = useState({ text: '', pageNumbering: true, confidentialTag: true });

  // Selection and Focus State Management
  const [activeTab, setActiveTab] = useState('component'); // 'component' | 'styling' | 'section' | 'headerFooter'
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };

  // --- Initial Data Load ---
  useEffect(() => {
    axios
      .get(`${REACT_APP_BASE_URL}/reports/${id}/versions/${versionId}`, {
        headers: authHeaders
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          if (res.data.sections) setSections(res.data.sections);
          if (res.data.header) setHeader(res.data.header);
          if (res.data.footer) setFooter(res.data.footer);
          if (res.data.reportName) setReportName(res.data.reportName);
        }
      })
      .catch((err) => console.error('Workspace initial data download exception:', err));
  }, [id, versionId]);

  // --- Save Modifications to Server (Handles Initial / Existing Updates seamlessly) ---
  const handleSaveDraft = async () => {
    try {
      const payload = { reportName, header, footer, sections, status: 'Draft' };

      // CORRECTED: Payload is 2nd argument, authHeaders config wrapper is 3rd argument
      await axios.put(`${REACT_APP_BASE_URL}/reports/${id}/versions/${versionId}`, payload, authHeaders);

      alert('Report structural configuration saved successfully.');
    } catch (err) {
      console.error('Save system transmission error:', err);
      alert('Failed to commit workspace updates.');
    }
  };

  // --- Version Cloning / Historical Import Flow Configuration ---
  const handleExecuteVersionCloning = async (historicalVersionId) => {
    try {
      const contextSettings = {
        sourceVersionId: historicalVersionId,
        targetVersionId: `v2.0_cloned_${Date.now()}`, // Or a dynamic modal user prompt value
        newReportName: `${reportName} (Updated Revision)`,
        importOptions: { headerFooter: true, sections: true, tables: true, images: true }
      };

      // Explicit path targeted cleanly to your specialized processing endpoint
      const response = await axios.post(`${REACT_APP_BASE_URL}/reports/import-version`, contextSettings, authHeaders);

      if (response.data && response.data.success) {
        setSections(response.data.data.sections);
        setHeader(response.data.data.header);
        setFooter(response.data.data.footer);
        alert('Historical section configurations imported smoothly!');
      }
    } catch (err) {
      console.error('Cloning engine execution failed: ', err);
      alert('Cloning error: ' + (err.response?.data?.error || err.message));
    }
  };

  // --- Section Management Functions (Google Forms Style) ---
  const handleAddSection = () => {
    const newSection = {
      id: 'sec_' + Date.now(),
      title: 'Dynamic Analysis Section Name',
      description: 'Enter cross-sectional execution summary notes or technical analyst descriptions here...',
      elements: []
    };
    setSections([...sections, newSection]);
    setSelectedSectionIndex(sections.length);
    setActiveTab('section');
  };

  const handleDuplicateSection = (index) => {
    const sectionToCopy = sections[index];
    const duplicatedSection = {
      ...sectionToCopy,
      id: 'sec_' + Date.now(),
      title: `${sectionToCopy.title} (Copy)`,
      elements: sectionToCopy.elements.map((el) => ({ ...el, id: 'el_' + Math.random().toString(36).substr(2, 9) }))
    };
    const updated = [...sections];
    updated.splice(index + 1, 0, duplicatedSection);
    setSections(updated);
  };

  const handleDeleteSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
    setSelectedSectionIndex(null);
    setSelectedElementId(null);
  };

  const handleMoveSection = (index, direction) => {
    const updated = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const [movedSection] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedSection);
    setSections(updated);
  };

  // --- Component Management Functions (Advanced Canvas Elements) ---
  const handleAddComponent = (type, forcedSectionIndex = null) => {
    const targetIndex = forcedSectionIndex !== null ? forcedSectionIndex : selectedSectionIndex !== null ? selectedSectionIndex : 0;
    if (sections.length === 0 || targetIndex >= sections.length) {
      alert('Please add or select a section card framework layout first.');
      return;
    }

    const baseElement = {
      id: 'el_' + Date.now(),
      type,
      x: 30,
      y: 150,
      w: 700,
      h: 240,
      zIndex: sections[targetIndex].elements.length + 1,
      textContent: type === 'text' ? 'Enter your custom rich narrative analysis data here...' : '',
      imageUrl: type === 'image' ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop' : '',
      imageLegend: '',
      imageDescription: '',
      imageAlignment: 'Center',
      tableRowsCount: 3,
      tableColsCount: 3,
      tableData: [
        ['Header A', 'Header B', 'Header C'],
        ['Data 1', 'Data 2', 'Data 3'],
        ['Data 4', 'Data 5', 'Data 6']
      ],
      tableLegend: '',
      tableDescription: '',
      isBold: false,
      isItalic: false,
      isBullet: false
    };

    const updated = [...sections];
    updated[targetIndex].elements.push(baseElement);
    setSections(updated);
    setSelectedElementId(baseElement.id);
    setSelectedSectionIndex(targetIndex);
    setActiveTab('component');
  };

  // ================= 2. LOCAL HARDWARE IMAGE FILE CONTROLLERS =================
  const handleLocalImageFileUploadStream = (e, sIdx, elId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Translate native blob target pointers into local image preview URI strings
    const temporaryLocalPreviewUrl = URL.createObjectURL(file);
    
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.map(item => 
      item.id === elId ? { ...item, imageUrl: temporaryLocalPreviewUrl } : item
    );
    setSections(updated);
  };

  // ================= 3. ADVANCED MATRIX TABLE CONTROLLER ENGINE FUNCTIONS =================
  const handleInsertTableRow = (sIdx, elId) => {
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.map(item => {
      if (item.id === elId) {
        const currentColsCount = item.tableData[0] ? item.tableData[0].length : 3;
        const freshRowPlaceholder = Array(currentColsCount).fill('New cell content');
        return { ...item, tableData: [...item.tableData, freshRowPlaceholder] };
      }
      return item;
    });
    setSections(updated);
  };

  const handleInsertTableColumn = (sIdx, elId) => {
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.map(item => {
      if (item.id === elId) {
        const expandedGrid = item.tableData.map((row, index) => [
          ...row, 
          index === 0 ? `Header ${String.fromCharCode(65 + row.length)}` : 'New cell data'
        ]);
        return { ...item, tableData: expandedGrid };
      }
      return item;
    });
    setSections(updated);
  };

  const handleDeleteTableRow = (sIdx, elId) => {
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.map(item => {
      if (item.id === elId) {
        if (item.tableData.length <= 1) {
          alert('Cannot delete the final remaining record row matrix layer.');
          return item;
        }
        const truncatedRows = [...item.tableData];
        truncatedRows.pop(); // Clear out the lower array bounds
        return { ...item, tableData: truncatedRows };
      }
      return item;
    });
    setSections(updated);
  };

  const handleDeleteTableColumn = (sIdx, elId) => {
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.map(item => {
      if (item.id === elId) {
        if (item.tableData[0] && item.tableData[0].length <= 1) {
          alert('Cannot delete the final remaining column dimension field.');
          return item;
        }
        const truncatedCols = item.tableData.map(row => {
          const r = [...row];
          r.pop(); // Drop outer array values
          return r;
        });
        return { ...item, tableData: truncatedCols };
      }
      return item;
    });
    setSections(updated);
  };

  // ================= 2. FORMATTING TOOLBAR TOGGLES INTERFACE =================
  const handleToggleFormat = (sIdx, elId, property) => {
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.map((el) => {
      if (el.id === elId) {
        return { ...el, [property]: !el[property] };
      }
      return el;
    });
    setSections(updated);
  };

  const handleUpdateSpatial = (sIdx, elId, updatedCoords) => {
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.map((el) => (el.id === elId ? { ...el, ...updatedCoords } : el));
    setSections(updated);
  };

  const handleDuplicateElement = (sIdx, elId) => {
    const updated = [...sections];
    const targetElement = updated[sIdx].elements.find((el) => el.id === elId);
    if (!targetElement) return;

    const cloned = {
      ...targetElement,
      id: 'el_' + Date.now() + Math.floor(Math.random() * 1000),
      x: targetElement.x + 20,
      y: targetElement.y + 20
    };
    updated[sIdx].elements.push(cloned);
    setSections(updated);
    setSelectedElementId(cloned.id);
  };

  const handleDeleteElement = (sIdx, elId) => {
    const updated = [...sections];
    updated[sIdx].elements = updated[sIdx].elements.filter((el) => el.id !== elId);
    setSections(updated);
    setSelectedElementId(null);
  };

  const handleCSVImport = (sIndex, elId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const matrix = text.split('\n').map((row) => row.split(','));
      const updated = [...sections];
      updated[sIndex].elements = updated[sIndex].elements.map((el) =>
        el.id === elId ? { ...el, tableData: matrix, tableRowsCount: matrix.length, tableColsCount: matrix[0]?.length || 0 } : el
      );
      setSections(updated);
    };
    reader.readAsText(file);
  };

  // A. Triggers opening the high-fidelity live HTML preview template in a separate browser tab
  const handleTriggerPreviewWindow = () => {
    window.open(`${REACT_APP_BASE_URL}/reports/${versionId}/preview`, '_blank');
  };

  // Get active configurations references
  const currentElement =
    selectedSectionIndex !== null && selectedElementId !== null
      ? sections[selectedSectionIndex]?.elements.find((el) => el.id === selectedElementId)
      : null;
  const currentSection = selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f4f6f9', overflow: 'hidden' }}>
      {/* ================= 1. TOP GLOBAL APP HEADER BAR NAVIGATION ================= */}
      <AppBar position="static" color="default" sx={{ borderBottom: '1px solid #dcdcdc', bgcolor: '#ffffff' }} elevation={0}>
        <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#1976d2',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              B
            </Box>
            <TextField
              variant="standard"
              size="small"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              inputProps={{ style: { fontWeight: 'bold', fontSize: 16, width: 420 } }}
            />
          </Box>
          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined" startIcon={<Save />} onClick={handleSaveDraft}>
              Save
            </Button>
            <Button size="small" variant="outlined" startIcon={<Visibility />} onClick={handleTriggerPreviewWindow}>
              Preview
            </Button>
            <Button size="small" variant="contained" color="success" startIcon={<Publish />}>
              Publish
            </Button>
            <Button size="small" variant="text" color="error" startIcon={<ExitToApp />} onClick={() => navigate(-1)}>
              Exit
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Studio Split Grid Frame */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ================= 2. CENTRAL BUILDER WORKSPACE REPORT AREA (Left/Center Canvas) ================= */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            bgcolor: '#eaecee'
          }}
        >
          {/* --- INLINED GLOBAL HEADER PARAMETERS SHEET --- */}
          <Card
            sx={{
              width: 816,
              bgcolor: '#ffffff',
              border: '1px solid #cbd5e0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                  label="Global Report Title Label"
                  fullWidth
                  size="small"
                  value={header.title}
                  onChange={(e) => setHeader({ ...header, title: e.target.value })}
                />
                <TextField
                  label="Sub Title Description String"
                  fullWidth
                  size="small"
                  value={header.subTitle}
                  onChange={(e) => setHeader({ ...header, subTitle: e.target.value })}
                />
                <TextField
                  label="Lead Analyst Author Identity"
                  fullWidth
                  size="small"
                  value={header.analystName}
                  onChange={(e) => setHeader({ ...header, analystName: e.target.value })}
                />
                <TextField
                  label="Generation Context Clock Date"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={header.date}
                  onChange={(e) => setHeader({ ...header, date: e.target.value })}
                />
              </Box>
            </CardContent>
          </Card>

          {/* ================= SECTIONS CANVAS COMPILER CYCLE ================= */}
          {sections.map((section, sIndex) => (
            <Card
              key={section.id}
              onClick={() => {
                setSelectedSectionIndex(sIndex);
              }}
              sx={{
                width: 816,
                minHeight: 620,
                bgcolor: '#ffffff',
                overflow: 'visible',
                position: 'relative',
                border: selectedSectionIndex === sIndex ? '2px solid #1976d2' : '1px solid #cbd5e0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                {/* Core Descriptive Text Parameters Header Layer Grid */}
                <Box display="flex" flexDirection="column" gap={1} mb={2}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Section Header Mapping Label Input String..."
                    value={section.title}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sIndex].title = e.target.value;
                      setSections(updated);
                    }}
                    inputProps={{ style: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' } }}
                  />
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Provide technical runtime execution description/context rule criteria constraints guidelines..."
                    value={section.description}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sIndex].description = e.target.value;
                      setSections(updated);
                    }}
                    inputProps={{ style: { fontSize: 13, color: '#7f8c8d' } }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* Localized Parent Coordinate Grid Engine Wrapper Space */}
                <Box
                  sx={{
                    width: '100%',
                    height: 460,
                    position: 'relative',
                    bgcolor: '#fbfcfc',
                    border: '1px dashed #bdc3c7',
                    borderRadius: 1,
                    overflow: 'hidden',
                    flexGrow: 1
                  }}
                >
                  {section.elements.map((el) => (
                    <Rnd
                      key={el.id}
                      size={{ width: el.w, height: el.h }}
                      position={{ x: el.x, y: el.y }}
                      onDragStop={(e, d) => handleUpdateSpatial(sIndex, el.id, { x: d.x, y: d.y })}
                      onResizeStop={(e, dir, ref, delta, pos) => {
                        handleUpdateSpatial(sIndex, el.id, {
                          w: parseInt(ref.style.width),
                          h: parseInt(ref.style.height),
                          ...pos
                        });
                      }}
                      bounds="parent"
                      dragHandleClassName="drag-handle-trigger-zone"
                      style={{
                        border: selectedElementId === el.id ? '2px solid #e67e22' : '1px dashed #cbd5e1',
                        zIndex: el.zIndex || 1,
                        padding: '26px 4px 4px 4px',
                        background: '#ffffff',
                        boxSizing: 'border-box'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId(el.id);
                        setSelectedSectionIndex(sIndex);
                      }}
                    >
                      {/* ================= NATIVE COMPONENT IN-PLACE CONTROLS HEADER BAR ================= */}
                      <Box
                        className="drag-handle-trigger-zone"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 24,
                          bgcolor: selectedElementId === el.id ? '#e67e22' : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          px: 1,
                          userSelect: 'none',
                          cursor: 'move'
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: selectedElementId === el.id ? '#fff' : '#475569', fontWeight: 'bold', fontSize: 10 }}
                        >
                          {el.type.toUpperCase()} OBJECT COMPONENT
                        </Typography>

                        <Box display="flex" alignItems="center" gap={0.5}>
                          <IconButton
                            size="small"
                            sx={{ p: 0.1, color: selectedElementId === el.id ? '#fff' : 'inherit' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateElement(sIndex, el.id);
                            }}
                            title="Duplicate Node Element"
                          >
                            <ContentCopy style={{ fontSize: 13 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            sx={{ p: 0.1, color: selectedElementId === el.id ? '#ffccd5' : 'inherit' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteElement(sIndex, el.id);
                            }}
                            title="Delete Node Element"
                          >
                            <Delete style={{ fontSize: 13 }} />
                          </IconButton>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', color: selectedElementId === el.id ? '#fff' : '#94a3b8', ml: 0.5 }}
                          >
                            <DragIndicator style={{ fontSize: 14 }} />
                          </Box>
                        </Box>
                      </Box>

                      {/* Framework Node Display Viewport Content Render Frame Switch */}
                      {/* Element Framework Routing Content Layer Switch */}
                      <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                        {/* TEXT BLOCK COMPONENT & FUNCTIONAL FORMATTING TOOLBAR STRIP */}
                        {el.type === 'text' && (
                          <Box display="flex" flexDirection="column" sx={{ width: '100%', height: '100%' }}>
                            {selectedElementId === el.id && (
                              <Box
                                display="flex"
                                gap={0.2}
                                p={0.2}
                                sx={{
                                  bgcolor: '#f8fafc',
                                  borderBottom: '1px solid #e2e8f0',
                                  mb: 0.5,
                                  borderRadius: '4px',
                                  alignItems: 'center'
                                }}
                              >
                                {/* Active Format Check Toggles */}
                                <IconButton
                                  size="small"
                                  sx={{ p: 0.2, bgcolor: el.isBold ? '#cbd5e1' : 'transparent', borderRadius: '4px' }}
                                  onClick={() => handleToggleFormat(sIndex, el.id, 'isBold')}
                                >
                                  <FormatBold style={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ p: 0.2, bgcolor: el.isItalic ? '#cbd5e1' : 'transparent', borderRadius: '4px' }}
                                  onClick={() => handleToggleFormat(sIndex, el.id, 'isItalic')}
                                >
                                  <FormatItalic style={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ p: 0.2, bgcolor: el.isBullet ? '#cbd5e1' : 'transparent', borderRadius: '4px' }}
                                  onClick={() => handleToggleFormat(sIndex, el.id, 'isBullet')}
                                >
                                  <FormatListBulleted style={{ fontSize: 14 }} />
                                </IconButton>

                                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                                <IconButton
                                  size="small"
                                  sx={{ p: 0.2, bgcolor: el.imageAlignment === 'Left' ? '#cbd5e1' : 'transparent', borderRadius: '4px' }}
                                  onClick={() => {
                                    const updated = [...sections];
                                    updated[sIndex].elements = updated[sIndex].elements.map((item) =>
                                      item.id === el.id ? { ...item, imageAlignment: 'Left' } : item
                                    );
                                    setSections(updated);
                                  }}
                                >
                                  <FormatAlignLeft style={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ p: 0.2, bgcolor: el.imageAlignment === 'Center' ? '#cbd5e1' : 'transparent', borderRadius: '4px' }}
                                  onClick={() => {
                                    const updated = [...sections];
                                    updated[sIndex].elements = updated[sIndex].elements.map((item) =>
                                      item.id === el.id ? { ...item, imageAlignment: 'Center' } : item
                                    );
                                    setSections(updated);
                                  }}
                                >
                                  <FormatAlignCenter style={{ fontSize: 14 }} />
                                </IconButton>
                              </Box>
                            )}

                            {/* Render System Bindings Text Input Fields container */}
                            <Box sx={{ display: 'flex', width: '100%', height: '100%', pl: el.isBullet ? 2 : 0 }}>
                              {el.isBullet && (
                                <Typography sx={{ mt: '5px', fontSize: 13, fontWeight: el.isBold ? 'bold' : 'normal' }}>•</Typography>
                              )}
                              <TextField
                                fullWidth
                                multiline
                                variant="standard"
                                placeholder="Type structural analysis notes right here..."
                                value={el.textContent}
                                onChange={(e) => {
                                  const updated = [...sections];
                                  updated[sIndex].elements = updated[sIndex].elements.map((element) =>
                                    element.id === el.id ? { ...element, textContent: e.target.value } : element
                                  );
                                  setSections(updated);
                                }}
                                InputProps={{ disableUnderline: selectedElementId !== el.id }}
                                inputProps={{
                                  style: {
                                    fontSize: 13,
                                    textAlign: el.imageAlignment?.toLowerCase() || 'left',
                                    fontWeight: el.isBold ? 'bold' : 'normal',
                                    fontStyle: el.isItalic ? 'italic' : 'normal',
                                    lineHeight: '1.4',
                                    padding: '4px'
                                  }
                                }}
                                sx={{ width: '100%', flexGrow: 1 }}
                              />
                            </Box>
                          </Box>
                        )}

                        {/* ================= IMAGE COMPONENT BLOCK ENGINE ================= */}
                        {el.type === 'image' && (
                          <Box display="flex" flexDirection="column" sx={{ width: '100%', height: '100%' }}>
                            {/* Image Management Mini Toolbar Strip */}
                            {selectedElementId === el.id && (
                              <Box
                                display="flex"
                                gap={0.2}
                                p={0.2}
                                sx={{
                                  bgcolor: '#f8fafc',
                                  borderBottom: '1px solid #e2e8f0',
                                  mb: 0.5,
                                  borderRadius: '4px',
                                  alignItems: 'center'
                                }}
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    p: 0.2,
                                    bgcolor: !el.imageAlignment || el.imageAlignment === 'Left' ? '#cbd5e1' : 'transparent',
                                    borderRadius: '4px'
                                  }}
                                  onClick={() => {
                                    const updated = [...sections];
                                    updated[sIndex].elements = updated[sIndex].elements.map((item) =>
                                      item.id === el.id ? { ...item, imageAlignment: 'Left' } : item
                                    );
                                    setSections(updated);
                                  }}
                                  title="Align Left"
                                >
                                  <FormatAlignLeft style={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ p: 0.2, bgcolor: el.imageAlignment === 'Center' ? '#cbd5e1' : 'transparent', borderRadius: '4px' }}
                                  onClick={() => {
                                    const updated = [...sections];
                                    updated[sIndex].elements = updated[sIndex].elements.map((item) =>
                                      item.id === el.id ? { ...item, imageAlignment: 'Center' } : item
                                    );
                                    setSections(updated);
                                  }}
                                  title="Align Center"
                                >
                                  <FormatAlignCenter style={{ fontSize: 14 }} />
                                </IconButton>

                                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                                {/* Dynamic Image URL Prompt Input Link */}
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<CloudUpload style={{ fontSize: 12 }} />}
                                  onClick={() => {
                                    const newUrl = prompt('Enter a fresh network Image URL link destination:', el.imageUrl);
                                    if (newUrl !== null) {
                                      const updated = [...sections];
                                      updated[sIndex].elements = updated[sIndex].elements.map((item) =>
                                        item.id === el.id ? { ...item, imageUrl: newUrl } : item
                                      );
                                      setSections(updated);
                                    }
                                  }}
                                  sx={{ fontSize: 10, py: 0, px: 1, minWidth: 'auto', textTransform: 'none' }}
                                >
                                  Change Source URL
                                </Button>
                                 {/* TRIGGER COMPUTATIONAL HARDWARE INPUT DIALOGUE BOX */}
                                <Button size="small" variant="outlined" color="primary" startIcon={<CloudUpload style={{ fontSize: 12 }} />} onClick={() => fileInputRef.current.click()} sx={{ fontSize: 10, py: 0, px: 1, textTransform: 'none', height: 20 }}>
                                  Upload from Computer
                                </Button>
                                {/* Hidden Pipeline Frame stream input */}
                                <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleLocalImageFileUploadStream(e, sIndex, el.id)} />
                              </Box>
                            )}

                            {/* Image Display Frame Canvas Panel */}
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems={el.imageAlignment === 'Center' ? 'center' : 'flex-start'}
                              sx={{ flexGrow: 1, overflow: 'hidden', p: 0.5 }}
                            >
                              <img
                                src={el.imageUrl || 'https://via.placeholder.com/400x200?text=Missing+Image+Asset+Node'}
                                alt="Data Plot Context Layout"
                                style={{ width: 'auto', maxHeight: selectedElementId === el.id ? '68%' : '85%', objectFit: 'contain' }}
                                draggable={false}
                              />

                              {/* Interactive Legend Text Input String Field */}
                              <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Add caption / figure asset legend summary notation label context..."
                                value={el.imageLegend || ''}
                                onChange={(e) => {
                                  const updated = [...sections];
                                  updated[sIndex].elements = updated[sIndex].elements.map((item) =>
                                    item.id === el.id ? { ...item, imageLegend: e.target.value } : item
                                  );
                                  setSections(updated);
                                }}
                                InputProps={{ disableUnderline: selectedElementId !== el.id }}
                                inputProps={{
                                  style: {
                                    fontSize: 11,
                                    fontStyle: 'italic',
                                    textAlign: el.imageAlignment === 'Center' ? 'center' : 'left',
                                    color: '#475569'
                                  }
                                }}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>
                        )}

                        {/* ================= TABLE NODE BLOCK ENGINE ================= */}
                        {/* ================= TABLE MATRIX ENGINE WITH STRUCTURAL DIMENSION EDITORS ================= */}
                        {el.type === 'table' && (
                          <Box display="flex" flexDirection="column" sx={{ width: '100%', height: '100%' }}>
                            {selectedElementId === el.id && (
                              <Box display="flex" gap={0.5} p={0.2} sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', mb: 0.5, borderRadius: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <Button size="small" variant="text" onClick={() => handleInsertTableRow(sIndex, el.id)} sx={{ fontSize: 10, py: 0, px: 0.5, textTransform: 'none', minWidth: 'auto', fontWeight: 'bold' }}>+ Add Row</Button>
                                <Button size="small" variant="text" onClick={() => handleInsertTableColumn(sIndex, el.id)} sx={{ fontSize: 10, py: 0, px: 0.5, textTransform: 'none', minWidth: 'auto', fontWeight: 'bold' }}>+ Add Col</Button>
                                <Divider orientation="vertical" flexItem sx={{ mx: 0.2 }} />
                                <Button size="small" variant="text" color="error" onClick={() => handleDeleteTableRow(sIndex, el.id)} sx={{ fontSize: 10, py: 0, px: 0.5, textTransform: 'none', minWidth: 'auto' }}>- Remove Row</Button>
                                <Button size="small" variant="text" color="error" onClick={() => handleDeleteTableColumn(sIndex, el.id)} sx={{ fontSize: 10, py: 0, px: 0.5, textTransform: 'none', minWidth: 'auto' }}>- Remove Col</Button>
                              </Box>
                            )}

                            <Box sx={{ p: 0.5, width: '100%', flexGrow: 1, overflow: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                <tbody>
                                  {el.tableData.map((row, ri) => (
                                    <tr key={ri} style={{ background: ri === 0 ? '#f1f5f9' : 'transparent' }}>
                                      {row.map((cell, ci) => (
                                        <td key={ci} style={{ border: '1px solid #cbd5e1', padding: '2px', textAlign: 'center', background: ri === 0 ? '#f1f5f9' : '#ffffff' }}>
                                          <input
                                            type="text"
                                            value={cell}
                                            disabled={selectedElementId !== el.id}
                                            onChange={(e) => {
                                              const updated = [...sections];
                                              updated[sIndex].elements = updated[sIndex].elements.map(item => {
                                                if (item.id === el.id) {
                                                  const gridCopy = item.tableData.map(r => [...r]);
                                                  gridCopy[ri][ci] = e.target.value;
                                                  return { ...item, tableData: gridCopy };
                                                }
                                                return item;
                                              });
                                              setSections(updated);
                                            }}
                                            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '11px', fontWeight: ri === 0 ? 'bold' : 'normal', color: '#334155', outline: 'none' }}
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <TextField fullWidth variant="standard" placeholder="Add table index notations summary description data..." value={el.tableLegend || ''} onChange={(e) => { const updated = [...sections]; updated[sIndex].elements = updated[sIndex].elements.map(item => item.id === el.id ? { ...item, tableLegend: e.target.value } : item); setSections(updated); }} InputProps={{ disableUnderline: selectedElementId !== el.id }} inputProps={{ style: { fontSize: 11, fontStyle: 'italic', color: '#64748b', marginTop: '4px' } }} />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Rnd>
                  ))}
                </Box>

                {/* Section Level Actions Controls Footer bar */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={2}
                  bgcolor="#f8f9fa"
                  p={1}
                  borderRadius={1}
                  sx={{ border: '1px solid #e2e8f0' }}
                >
                  <Box display="flex" gap={1}>
                    <Button size="small" variant="text" startIcon={<ContentCopy />} onClick={() => handleDuplicateSection(sIndex)}>
                      Duplicate Section
                    </Button>
                    <Button size="small" variant="text" color="error" startIcon={<Delete />} onClick={() => handleDeleteSection(sIndex)}>
                      Delete Section
                    </Button>
                  </Box>
                  <Box display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      disabled={sIndex === 0}
                      onClick={() => handleMoveSection(sIndex, 'up')}
                      title="Move Section Up"
                    >
                      <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={sIndex === sections.length - 1}
                      onClick={() => handleMoveSection(sIndex, 'down')}
                      title="Move Section Down"
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* ================= 3. RIGHT SIDEBAR WORKSPACE TOOLBOX PANEL ================= */}

        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            right: 20,
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            bgcolor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            p: 1,
            zIndex: 1000
          }}
        >
          <Tooltip title="Add Section" placement="left">
            <IconButton color="primary" onClick={handleAddSection}>
              <AddCircle />
            </IconButton>
          </Tooltip>

          <Divider flexItem />

          <Tooltip title="Text Block" placement="left">
            <IconButton onClick={() => handleAddComponent('text')}>
              <TextFields />
            </IconButton>
          </Tooltip>

          <Tooltip title="Image Block" placement="left">
            <IconButton onClick={() => handleAddComponent('image')}>
              <ImageIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Table Block" placement="left">
            <IconButton onClick={() => handleAddComponent('table')}>
              <TableChart />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
