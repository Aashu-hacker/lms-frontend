import React, { useState, useEffect } from 'react';
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
  FormatAlignLeft
} from '@mui/icons-material';
import axios from 'axios';

import REACT_APP_BASE_URL from 'utils/api';

import Swal from 'sweetalert2';

export default function ReportWorkspaceStudio() {
  const { id, versionId } = useParams();
  const navigate = useNavigate();

  // --- Core Application State Structure ---
  const [reportName, setReportName] = useState('Market Analytics Report');
  const [header, setHeader] = useState({
    logo: '',
    title: '',
    subTitle: '',
    analystName: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [footer, setFooter] = useState({ text: '', pageNumbering: true, confidentialTag: true });
  const [sections, setSections] = useState([]);

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
      w: 400,
      h: 220,
      zIndex: sections[targetIndex].elements.length + 1,
      textContent: type === 'text' ? 'Enter your custom rich narrative analysis data here...' : '',
      imageUrl: type === 'image' ? 'https://via.placeholder.com/400x200?text=Data+Visualization+Plot' : '',
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
      tableDescription: ''
    };

    const updated = [...sections];
    updated[targetIndex].elements.push(baseElement);
    setSections(updated);
    setSelectedElementId(baseElement.id);
    setSelectedSectionIndex(targetIndex);
    setActiveTab('component');
  };

  const handleDuplicateElement = (sIndex, elId) => {
    const updated = [...sections];
    const element = updated[sIndex].elements.find((e) => e.id === elId);
    if (!element) return;
    const copiedElement = { ...element, id: 'el_' + Date.now(), x: element.x + 20, y: element.y + 20 };
    updated[sIndex].elements.push(copiedElement);
    setSections(updated);
    setSelectedElementId(copiedElement.id);
  };

  const handleDeleteElement = (sIndex, elId) => {
    const updated = [...sections];
    updated[sIndex].elements = updated[sIndex].elements.filter((e) => e.id !== elId);
    setSections(updated);
    setSelectedElementId(null);
  };

  const handleUpdateSpatial = (sIndex, elId, spatialData) => {
    const updated = [...sections];
    updated[sIndex].elements = updated[sIndex].elements.map((el) => (el.id === elId ? { ...el, ...spatialData } : el));
    setSections(updated);
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
      {/* ================= 1. TOP NAVIGATION BAR ================= */}
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
              inputProps={{ style: { fontWeight: 'bold', fontSize: 16 } }}
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

      {/* Main Framework Working Body Split Screen Studio Grid */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ================= 2. LEFT SIDEBAR PANEL ================= */}
        <Box
          sx={{ width: 260, bgcolor: '#ffffff', borderRight: '1px solid #e0e0e0', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography variant="caption" sx={{ color: '#7f8c8d', fontWeight: 'bold', letterSpacing: 1 }}>
            WORKSPACE TOOLBOX
          </Typography>
          <Button fullWidth variant="contained" color="primary" startIcon={<AddCircle />} onClick={handleAddSection}>
            Add Section
          </Button>

          <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fdfefe' }}>
            <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>
              + ADD CANVAS COMPONENT
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Button size="small" fullWidth variant="outlined" startIcon={<TextFields />} onClick={() => handleAddComponent('text')}>
                + Text Block
              </Button>
              <Button size="small" fullWidth variant="outlined" startIcon={<ImageIcon />} onClick={() => handleAddComponent('image')}>
                + Image Block
              </Button>
              <Button size="small" fullWidth variant="outlined" startIcon={<TableChart />} onClick={() => handleAddComponent('table')}>
                + Table Block
              </Button>
            </Box>
          </Paper>

          <Divider />
          <Typography variant="caption" sx={{ color: '#7f8c8d', fontWeight: 'bold' }}>
            NAVIGATION REGISTRY
          </Typography>
          <List size="small" disablePadding sx={{ overflowY: 'auto', flexGrow: 1 }}>
            {['Reports List', 'Drafts Database', 'System Templates', 'Previous Versions Registry'].map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton dense sx={{ py: 0.5 }}>
                  <ListItemText primary={text} primaryTypographyProps={{ style: { fontSize: 13, color: '#333' } }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* ================= 3. CENTRAL MAIN BUILDER AREA ================= */}
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
          {sections.map((section, sIndex) => (
            <Card
              key={section.id}
              onClick={() => {
                setSelectedSectionIndex(sIndex);
                setActiveTab('section');
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
              <CardContent sx={{ p: 3, height: '100%', boxSizing: 'border-box' }}>
                {/* Section Cards Headers Design inputs */}
                <Box display="flex" flexDirection="column" gap={1} mb={2}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Section Title Layout Input"
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
                    placeholder="Section Subtitle/Execution Guidelines Description Context String"
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
                    overflow: 'hidden'
                  }}
                >
                  {section.elements.map((el) => (
                    <Rnd
                      key={el.id}
                      size={{ width: el.w, height: el.h }}
                      position={{ x: el.x, y: el.y }}
                      onDragStop={(e, d) => handleUpdateSpatial(sIndex, el.id, { x: d.x, y: d.y })}
                      onResizeStop={(e, dir, ref, delta, pos) => {
                        handleUpdateSpatial(sIndex, el.id, { w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos });
                      }}
                      bounds="parent"
                      style={{
                        border: selectedElementId === el.id ? '2px solid #e67e22' : '1px dashed #cbd5e1',
                        zIndex: el.zIndex || 1,
                        padding: 2,
                        background: '#ffffff'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId(el.id);
                        setSelectedSectionIndex(sIndex);
                        setActiveTab('component');
                      }}
                    >
                      {/* Component Node Dynamic Rendering Frame */}
                      <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                        {el.type === 'text' && (
                          <Typography
                            sx={{ fontSize: 13, p: 1, whiteSpace: 'pre-wrap', textAlign: el.imageAlignment?.toLowerCase() || 'left' }}
                          >
                            {el.textContent || 'Empty Dynamic Text Layer Narrative.'}
                          </Typography>
                        )}

                        {el.type === 'image' && (
                          <Box
                            width="100%"
                            height="100%"
                            display="flex"
                            flexDirection="column"
                            alignItems={
                              el.imageAlignment === 'Center' ? 'center' : el.imageAlignment === 'Right' ? 'flex-end' : 'flex-start'
                            }
                          >
                            <img
                              src={el.imageUrl}
                              alt="Data Plot Graphic"
                              style={{ width: 'auto', maxHeight: '75%', objectFit: 'contain' }}
                              draggable={false}
                            />
                            <Typography variant="caption" sx={{ fontStyle: 'italic', mt: 0.5, color: '#555', px: 1 }}>
                              {el.imageLegend}
                            </Typography>
                          </Box>
                        )}

                        {el.type === 'table' && (
                          <Box sx={{ p: 0.5, width: '100%', height: '100%', overflow: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                              <tbody>
                                {el.tableData.map((row, ri) => (
                                  <tr key={ri} style={{ background: ri === 0 ? '#f4f6f7' : 'transparent' }}>
                                    {row.map((cell, ci) => (
                                      <td
                                        key={ci}
                                        style={{
                                          border: '1px solid #cbd5e1',
                                          padding: '4px',
                                          textAlign: 'center',
                                          fontWeight: ri === 0 ? 'bold' : 'normal'
                                        }}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                              {el.tableLegend}
                            </Typography>
                          </Box>
                        )}

                        {/* Drag Handle Tagging indicators */}
                        <Box
                          className="drag-handle"
                          sx={{ position: 'absolute', top: 2, right: 2, cursor: 'move', opacity: 0.4, '&:hover': { opacity: 1 } }}
                        >
                          <DragIndicator fontSize="small" />
                        </Box>
                      </Box>
                    </Rnd>
                  ))}
                </Box>

                {/* Section Level Actions Controls Footer bar */}
                <Box display="flex" justifyContent="space-between" mt={2} bgcolor="#f8f9fa" p={1} borderRadius={1}>
                  <Box display="flex" gap={1}>
                    <Button size="small" variant="text" startIcon={<ContentCopy />} onClick={() => handleDuplicateSection(sIndex)}>
                      Duplicate
                    </Button>
                    <Button size="small" variant="text" color="error" startIcon={<Delete />} onClick={() => handleDeleteSection(sIndex)}>
                      Delete
                    </Button>
                  </Box>
                  <Box>
                    <IconButton size="small" disabled={sIndex === 0} onClick={() => handleMoveSection(sIndex, 'up')}>
                      <ArrowUpward />
                    </IconButton>
                    <IconButton size="small" disabled={sIndex === sections.length - 1} onClick={() => handleMoveSection(sIndex, 'down')}>
                      <ArrowDownward />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* ================= 4. RIGHT PROPERTIES PANEL ================= */}
        <Box sx={{ width: 320, bgcolor: '#ffffff', borderLeft: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
          {/* Tab Selection Switches Header row */}
          <Box display="flex" bgcolor="#f4f6f9" sx={{ borderBottom: '1px solid #e0e0e0' }}>
            {['component', 'section', 'headerFooter'].map((tab) => (
              <Button
                key={tab}
                size="small"
                onClick={() => setActiveTab(tab)}
                sx={{
                  flexGrow: 1,
                  borderRadius: 0,
                  py: 1,
                  fontSize: 11,
                  fontWeight: 'bold',
                  borderBottom: activeTab === tab ? '3px solid #1976d2' : 'none',
                  color: activeTab === tab ? '#1976d2' : '#555'
                }}
              >
                {tab === 'headerFooter' ? 'H/F Settings' : `${tab.toUpperCase()}`}
              </Button>
            ))}
          </Box>

          <Box sx={{ p: 2.5, overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* --- COMPONENT SETTINGS TAB MODES --- */}
            {activeTab === 'component' && currentElement && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={1} bgcolor="#f8fafc" borderRadius={1}>
                  <Typography variant="subtitle2" sx={{ color: '#1976d2' }}>
                    Type: {currentElement.type.toUpperCase()}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleDuplicateElement(selectedSectionIndex, currentElement.id)}>
                      <ContentCopy fontSize="inherit" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteElement(selectedSectionIndex, currentElement.id)}>
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Box>

                {/* TEXT COMPONENT SUB-PROPERTIES CONFIGURATION FORM */}
                {currentElement.type === 'text' && (
                  <>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#555' }}>
                      Rich Text Layer Editor Alignment Options
                    </Typography>
                    <Box display="flex" gap={0.5} p={0.5} bgcolor="#f0f2f5" borderRadius={1}>
                      <IconButton size="small">
                        <FormatBold fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <FormatItalic fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <FormatListBulleted fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <FormatAlignLeft fontSize="small" />
                      </IconButton>
                    </Box>
                    <TextField
                      label="Text Context Content Area"
                      multiline
                      rows={8}
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={currentElement.textContent}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                          el.id === selectedElementId ? { ...el, textContent: e.target.value } : el
                        );
                        setSections(updated);
                      }}
                    />
                  </>
                )}

                {/* IMAGE COMPONENT SUB-PROPERTIES CONFIGURATION FORM */}
                {currentElement.type === 'image' && (
                  <>
                    <Button variant="outlined" component="label" fullWidth startIcon={<CloudUpload />} size="small">
                      Upload Image File
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            const updated = [...sections];
                            updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                              el.id === selectedElementId ? { ...el, imageUrl: url } : el
                            );
                            setSections(updated);
                          }
                        }}
                      />
                    </Button>
                    <TextField
                      label="Image Custom URL Direct Link"
                      fullWidth
                      size="small"
                      value={currentElement.imageUrl}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                          el.id === selectedElementId ? { ...el, imageUrl: e.target.value } : el
                        );
                        setSections(updated);
                      }}
                    />
                    <TextField
                      label="Image Legend / Table Caption String"
                      fullWidth
                      size="small"
                      value={currentElement.imageLegend}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                          el.id === selectedElementId ? { ...el, imageLegend: e.target.value } : el
                        );
                        setSections(updated);
                      }}
                    />
                    <TextField
                      label="Analytical Execution Description Data"
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      value={currentElement.imageDescription}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                          el.id === selectedElementId ? { ...el, imageDescription: e.target.value } : el
                        );
                        setSections(updated);
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      Horizontal Component Axis Alignment
                    </Typography>
                    <ToggleButtonGroup
                      size="small"
                      color="primary"
                      value={currentElement.imageAlignment || 'Center'}
                      exclusive
                      fullWidth
                      onChange={(e, val) => {
                        if (!val) return;
                        const updated = [...sections];
                        updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                          el.id === selectedElementId ? { ...el, imageAlignment: val } : el
                        );
                        setSections(updated);
                      }}
                    >
                      <ToggleButton value="Left">Left</ToggleButton>
                      <ToggleButton value="Center">Center</ToggleButton>
                      <ToggleButton value="Right">Right</ToggleButton>
                    </ToggleButtonGroup>
                  </>
                )}

                {/* TABLE COMPONENT SUB-PROPERTIES CONFIGURATION FORM */}
                {currentElement.type === 'table' && (
                  <>
                    <Box display="flex" gap={1}>
                      <TextField
                        label="Rows Count"
                        type="number"
                        size="small"
                        value={currentElement.tableRowsCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const updated = [...sections];
                          updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                            el.id === selectedElementId ? { ...el, tableRowsCount: val } : el
                          );
                          setSections(updated);
                        }}
                      />
                      <TextField
                        label="Cols Count"
                        type="number"
                        size="small"
                        value={currentElement.tableColsCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const updated = [...sections];
                          updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                            el.id === selectedElementId ? { ...el, tableColsCount: val } : el
                          );
                          setSections(updated);
                        }}
                      />
                    </Box>
                    <Button variant="outlined" component="label" fullWidth startIcon={<CloudUpload />} size="small">
                      Import CSV / Excel Sheet
                      <input
                        type="file"
                        hidden
                        accept=".csv"
                        onChange={(e) => handleCSVImport(selectedSectionIndex, currentElement.id, e)}
                      />
                    </Button>
                    <TextField
                      label="Table Caption / Data Legend text"
                      fullWidth
                      size="small"
                      value={currentElement.tableLegend}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                          el.id === selectedElementId ? { ...el, tableLegend: e.target.value } : el
                        );
                        setSections(updated);
                      }}
                    />
                    <TextField
                      label="Table Statistical Analytical Summary"
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      value={currentElement.tableDescription}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIndex].elements = updated[selectedSectionIndex].elements.map((el) =>
                          el.id === selectedElementId ? { ...el, tableDescription: e.target.value } : el
                        );
                        setSections(updated);
                      }}
                    />
                  </>
                )}
              </Box>
            )}

            {/* --- SECTION GENERAL SETTINGS CONFIG TAB --- */}
            {activeTab === 'section' && currentSection && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                  Section Config Parameters
                </Typography>
                <TextField
                  label="Section Header Label"
                  fullWidth
                  size="small"
                  value={currentSection.title}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[selectedSectionIndex].title = e.target.value;
                    setSections(updated);
                  }}
                />
                <TextField
                  label="Technical Context Guideline text"
                  multiline
                  rows={4}
                  fullWidth
                  size="small"
                  value={currentSection.description}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[selectedSectionIndex].description = e.target.value;
                    setSections(updated);
                  }}
                />
              </Box>
            )}

            {/* --- GLOBAL HEADER & FOOTER SETTINGS TAB --- */}
            {activeTab === 'headerFooter' && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                  Header Global Settings
                </Typography>
                <TextField
                  label="Global Report Title Label"
                  fullWidth
                  size="small"
                  value={header.title}
                  onChange={(e) => setHeader({ ...header, title: e.target.value })}
                />
                <TextField
                  label="Sub Title Description"
                  fullWidth
                  size="small"
                  value={header.subTitle}
                  onChange={(e) => setHeader({ ...header, subTitle: e.target.value })}
                />
                <TextField
                  label="Lead Analyst Author"
                  fullWidth
                  size="small"
                  value={header.analystName}
                  onChange={(e) => setHeader({ ...header, analystName: e.target.value })}
                />
                <TextField
                  label="Generation Date Parameters"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={header.date}
                  onChange={(e) => setHeader({ ...header, date: e.target.value })}
                />

                <Divider sx={{ my: 1 }} />

                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                  Footer Page Metrics Settings
                </Typography>
                <TextField
                  label="Default Disclaimer Footer Text"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  value={footer.text}
                  onChange={(e) => setFooter({ ...footer, text: e.target.value })}
                />
                <FormControlLabel
                  control={
                    <Switch checked={footer.pageNumbering} onChange={(e) => setFooter({ ...footer, pageNumbering: e.target.checked })} />
                  }
                  label="Enable Continuous Page Numbering"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={footer.confidentialTag}
                      onChange={(e) => setFooter({ ...footer, confidentialTag: e.target.checked })}
                    />
                  }
                  label="Enable Confidentiality Layout Tag"
                />
              </Box>
            )}

            {!currentElement && activeTab === 'component' && (
              <Typography variant="body2" sx={{ color: '#95a5a6', fontStyle: 'italic', textAlign: 'center', mt: 4 }}>
                Select an object node block inside a section canvas framework sheet to adjust parameters.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
