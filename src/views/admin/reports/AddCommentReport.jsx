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
  Select,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  Fab,
  Avatar,
  Chip
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
  FormatAlignCenter,
  FormatUnderlined,
  FormatAlignRight,
  FormatColorText,
  BorderColor
} from '@mui/icons-material';
import axios from 'axios';

import AddCommentIcon from '@mui/icons-material/AddComment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotesIcon from '@mui/icons-material/Notes';
import SendIcon from '@mui/icons-material/Send';

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
          isUnderline: false,
          isBullet: false,
          fontFamily: 'Arial',
          fontSize: 13,
          fontColor: '#000000',
          highlightColor: 'transparent'
        }
      ]
    }
  ]);
  const [footer, setFooter] = useState({ text: '', pageNumbering: true, confidentialTag: true });

  // Selection and Focus State Management
  const [activeTab, setActiveTab] = useState('component'); // 'component' | 'styling' | 'section' | 'headerFooter'
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);

  const [activityOpen, setActivityOpen] = useState(false);
  const reportRef = useRef(null);

  const [commentMode, setCommentMode] = useState(false);

  const [comments, setComments] = useState([]);

  const [isPublished, setIsPublished] = useState(false);

  const [commentPopup, setCommentPopup] = useState(false);

  const [clickedPosition, setClickedPosition] = useState({
    x: 0,
    y: 0
  });

  const [commentText, setCommentText] = useState('');

  const [commentImage, setCommentImage] = useState(null);

  const [hoverComment, setHoverComment] = useState(null);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  const user = getUser();

  // --- Initial Data Load ---
  useEffect(() => {
    axios
      .get(`${REACT_APP_BASE_URL}/reports/${id}/versions/${versionId}`, {
        headers: authHeaders
      })

      .then((res) => {
        // console.log(res);
        if (!res.data) return;
        if (res.data.sections) {
          const normalizedSections = res.data.sections.map((section) => ({
            ...section,
            elements: section.elements.map((el) => {
              if (el.type !== 'text') return el;
              return {
                ...el,
                imageAlignment: el.imageAlignment ?? 'Left',
                isBold: el.isBold ?? false,
                isItalic: el.isItalic ?? false,
                isUnderline: el.isUnderline ?? false,
                isBullet: el.isBullet ?? false,
                fontFamily: el.fontFamily ?? 'Arial',
                fontSize: el.fontSize ?? 13,
                fontColor: el.fontColor ?? '#000000',
                highlightColor: el.highlightColor ?? 'transparent'
              };
            })
          }));

          setSections(normalizedSections);
        }
        if (res.data.header) {
          setHeader(res.data.header);
        }
        if (res.data.footer) {
          setFooter(res.data.footer);
        }
        if (res.data.reportName) {
          setReportName(res.data.reportName);
        }
      })
      .catch((err) => {
        console.error('Workspace initial data download exception:', err);
      });
    loadComments();
  }, [id, versionId]);

  const loadComments = async () => {
    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}/reports/get-report-comments/${id}/${versionId}`, {
        headers: authHeaders
      });

      console.log(response);

      setComments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateCommentStatus = async (commentId, status) => {
    try {
      const res = await axios.put(
        `${REACT_APP_BASE_URL}/reports/report-comments/${commentId}`,
        {
          user_id: user._id,
          status
        },
        {
          headers: authHeaders
        }
      );

      setComments((prev) => prev.map((item) => (item._id === commentId ? res.data : item)));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendBackToAnalyst = async () => {
    const result = await Swal.fire({
      title: 'Send report back?',
      text: 'This report will be sent back to analyst for modifications.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send Back',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f59e0b',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: 'Sending...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const res = await axios.put(
        `${REACT_APP_BASE_URL}/reports/${id}/versions/${versionId}/send-back`,
        { user },
        { headers: authHeaders }
      );

      Swal.fire({
        icon: 'success',
        title: 'Sent Back',
        text: res.data.message,
        confirmButtonColor: '#10b981'
      }).then(() => {
        navigate(-1);
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err.response?.data?.message || 'Something went wrong'
      });
    }
  };

  const handlePublishReport = async () => {
    const result = await Swal.fire({
      title: 'Publish Report?',
      text: 'This report will become visible to client users.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Publish',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: 'Publishing...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const res = await axios.put(`${REACT_APP_BASE_URL}/reports/${id}/versions/${versionId}/publish`, { user }, { headers: authHeaders });

      Swal.fire({
        icon: 'success',
        title: 'Published Successfully',
        text: res.data.message,
        confirmButtonColor: '#16a34a'
      }).then(() => {
        setIsPublished(true); // disable buttons
        // navigate(-1);
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Publish Failed',
        text: err.response?.data?.message || 'Something went wrong'
      });
    }
  };

  const updateManagerNote = async (id, note) => {
    const result = await Swal.fire({
      title: 'Update Note?',
      text: 'Do you want to save this manager note?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(`${REACT_APP_BASE_URL}/reports/report-comments/${id}/note`, {
        managerNote: note
      });

      Swal.fire({
        title: 'Updated!',
        text: 'Manager note updated successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Failed!',
        text: 'Failed to update note.',
        icon: 'error'
      });
    }
  };

  const deleteComment = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${REACT_APP_BASE_URL}/reports/report-comments/${id}`);

      setComments((prev) => prev.filter((c) => c._id !== id));

      Swal.fire({
        title: 'Deleted!',
        text: 'Comment deleted successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch {
      Swal.fire({
        title: 'Failed!',
        text: 'Failed to delete comment.',
        icon: 'error'
      });
    }
  };

  // Get active configurations references
  const currentElement =
    selectedSectionIndex !== null && selectedElementId !== null
      ? sections[selectedSectionIndex]?.elements.find((el) => el.id === selectedElementId)
      : null;
  const currentSection = selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;

  const handleReportClick = (e) => {
    if (!commentMode) return;
    const rect = reportRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickedPosition({
      x,
      y
    });
    setCommentPopup(true);
    setCommentMode(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#f4f6f9', overflow: 'hidden' }}>
      {/* ================= 1. TOP GLOBAL APP HEADER BAR NAVIGATION ================= */}
      <AppBar
        position="relative" // Changed to sticky so the toolbar stays fixed at the top while scrolling down long reports
        color="default"
        // zIndex: (theme) => theme.zIndex.drawer + 1
        sx={{ borderBottom: '1px solid #dcdcdc', bgcolor: '#ffffff' }}
        elevation={0}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            bgcolor: '#fff'
          }}
        >
          {/* LEFT */}

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
              value={reportName}
              inputProps={{
                readOnly: true,
                style: {
                  fontWeight: 700,
                  fontSize: 18,
                  width: 650
                }
              }}
            />
          </Box>

          {/* RIGHT */}

          <Box display="flex" gap={1}>
            {/* <Button size="small" variant="outlined" startIcon={<Visibility />}>
              Preview
            </Button> */}

            {/* SEND BACK */}

            <Button
              size="small"
              color="warning"
              variant="contained"
              disabled={comments.length === 0 || isPublished}
              startIcon={<ReplyIcon />}
              onClick={() => {
                handleSendBackToAnalyst();
              }}
            >
              Send Back
            </Button>

            <Button
              size="small"
              color="success"
              variant="contained"
              disabled={comments.some((x) => x.status !== 'resolved') || isPublished}
              startIcon={<Publish />}
              onClick={() => {
                handlePublishReport();
              }}
            >
              Publish To Client
            </Button>

            <Button size="small" color="error" variant="text" startIcon={<ExitToApp />} onClick={() => navigate(-1)}>
              Exit
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          position: 'fixed',
          bottom: 25,
          right: 25,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          zIndex: 99999
        }}
      >
        {/* Activity Button */}
        <Fab
          color="secondary"
          onClick={() => setActivityOpen(true)}
          sx={{
            boxShadow: '0 6px 20px rgba(0,0,0,.2)'
          }}
        >
          <VisibilityIcon />
        </Fab>
        {/* Comment Button */}
        <Fab
          variant="extended"
          color={commentMode ? 'secondary' : 'primary'}
          onClick={() => {
            setCommentMode((prev) => !prev);

            if (commentMode) {
              setCommentPopup(false);
            }
          }}
        >
          <AddCommentIcon />

          {commentMode ? 'Cancel' : ''}
        </Fab>
      </Box>
      {/* Main Studio Split Grid Frame */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box
          ref={reportRef}
          onClick={handleReportClick}
          sx={{
            position: 'relative',
            cursor: commentMode ? 'crosshair' : 'default',
            flexGrow: 1,
            overflowY: 'hidden',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            bgcolor: '#eaecee'
          }}
        >
          {/* ================= 2. CENTRAL BUILDER WORKSPACE REPORT AREA (Left/Center Canvas) ================= */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              bgcolor: '#eaecee'
            }}
          >
            {/* --- INLINED GLOBAL HEADER PARAMETERS SHEET --- */}
            <Card
              sx={{
                width: '100%',
                maxWidth: 1370, // Standard Google Forms width preference
                bgcolor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #dadce0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                position: 'relative',
                overflow: 'visible', // Keeps the top strip layout crisp
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '10px', // Iconic Google Forms top accent bar
                  backgroundColor: '#673ab7', // Classic form purple (change to #1976d2 if you prefer your brand blue)
                  borderTopLeftRadius: '7px',
                  borderTopRightRadius: '7px'
                }
              }}
            >
              <CardContent sx={{ p: 4, pt: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Main Title Field */}
                <TextField
                  placeholder="Header Title"
                  variant="standard"
                  fullWidth
                  value={header.title}
                  onChange={(e) => setHeader({ ...header, title: e.target.value })}
                  inputProps={{
                    style: { fontSize: '32px', fontFamily: 'Google Sans, Roboto, Arial', fontWeight: 400 }
                  }}
                  InputProps={{ disableUnderline: false, readOnly: true }}
                  sx={{
                    '& .MuiInput-root:before': { borderBottomColor: 'transparent' }, // Hides default line until focus
                    '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottomColor: 'rgba(0, 0, 0, 0.12)' }
                  }}
                />

                {/* Subtitle / Description Field */}
                <TextField
                  placeholder="Header short description"
                  variant="standard"
                  fullWidth
                  multiline
                  value={header.subTitle}
                  onChange={(e) => setHeader({ ...header, subTitle: e.target.value })}
                  InputProps={{
                    readOnly: true
                  }}
                  inputProps={{ style: { fontSize: '14px', fontFamily: 'Roboto, Arial' } }}
                  sx={{
                    '& .MuiInput-root:before': { borderBottomColor: 'transparent' },
                    '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottomColor: 'rgba(0, 0, 0, 0.12)' }
                  }}
                />

                {/* Metadata section (Analyst & Date) */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                  <TextField
                    label="Lead Analyst Author Identity"
                    variant="filled"
                    fullWidth
                    size="small"
                    value={header.analystName}
                    onChange={(e) => setHeader({ ...header, analystName: e.target.value })}
                    InputProps={{ readOnly: true }}
                    sx={{ bgcolor: '#f8f9fa' }}
                  />

                  <TextField
                    label="Generation Context Clock Date"
                    type="date"
                    variant="filled"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={header.date}
                    onChange={(e) => setHeader({ ...header, date: e.target.value })}
                    InputProps={{ readOnly: true }}
                    sx={{ bgcolor: '#f8f9fa' }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* ================= SECTIONS CANVAS COMPILER CYCLE ================= */}
            {sections.map((section, sIndex) => (
              <Card
                key={section.id}
                sx={{
                  width: '100%',
                  maxWidth: '1370px', // Matches standard Google Forms width ceiling
                  mx: 'auto',
                  mb: 3,
                  height: 'auto',
                  bgcolor: '#ffffff',
                  overflow: 'visible',
                  position: 'relative',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                  {/* Core Descriptive Text Parameters Header Layer Grid */}
                  <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Add section heading here.."
                      value={section.title}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sIndex].title = e.target.value;
                        setSections(updated);
                      }}
                      InputProps={{
                        readOnly: true
                      }}
                      inputProps={{ style: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' } }}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Add section short description here..."
                      value={section.description}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sIndex].description = e.target.value;
                        setSections(updated);
                      }}
                      InputProps={{
                        readOnly: true
                      }}
                      inputProps={{ style: { fontSize: 13, color: '#7f8c8d' } }}
                    />
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Localized Parent Coordinate Grid Engine Wrapper Space */}
                  <Box display="flex" flexDirection="column" gap={3} sx={{ width: '100%', flexGrow: 1 }}>
                    {section.elements &&
                      section.elements.map((el, elIndex) => (
                        <Box
                          key={el.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            createCommentPosition(e, el.id);
                            setSelectedElementId(el.id);
                            setSelectedSectionIndex(sIndex);
                          }}
                          sx={{
                            width: '100%',
                            border: selectedElementId === el.id ? '2px solid #e67e22' : '1px solid #cbd5e1',
                            borderRadius: 1,
                            padding: '36px 16px 16px 16px', // Shifted up padding to comfortably sit below header
                            background: '#ffffff',
                            boxSizing: 'border-box',
                            position: 'relative'
                          }}
                        >
                          {/* ================= NATIVE COMPONENT IN-PLACE CONTROLS HEADER BAR ================= */}

                          {/* Framework Node Display Viewport Content Render Frame Switch */}
                          {/* Element Framework Routing Content Layer Switch */}
                          <Box sx={{ width: '100%', height: 'auto', overflow: 'hidden', position: 'relative' }}>
                            {/* TEXT BLOCK COMPONENT & FUNCTIONAL FORMATTING TOOLBAR STRIP */}
                            {el.type === 'text' && (
                              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', width: '100%', pl: el.isBullet ? 2 : 0 }}>
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
                                        fontSize: el.fontSize || 13,
                                        fontFamily: el.fontFamily || 'Arial',
                                        textAlign: el.imageAlignment?.toLowerCase() || 'left',
                                        fontWeight: el.isBold ? 'bold' : 'normal',
                                        fontStyle: el.isItalic ? 'italic' : 'normal',
                                        textDecoration: el.isUnderline ? 'underline' : 'none',
                                        color: el.fontColor || '#000000',
                                        backgroundColor: el.highlightColor || 'transparent',
                                        lineHeight: '1.4',
                                        padding: '4px',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                      },
                                      readOnly: true
                                    }}
                                    sx={{
                                      width: '100%',
                                      flexGrow: 1,

                                      '& .MuiInputBase-root': {
                                        height: '100%',
                                        alignItems: 'flex-start'
                                      },

                                      '& textarea': {
                                        overflow: 'auto'
                                      }
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}

                            {/* ================= IMAGE COMPONENT BLOCK ENGINE ================= */}
                            {el.type === 'image' && (
                              <Box display="flex" flexDirection="column" sx={{ width: '100%', height: '100%' }}>
                                {/* Image Management Mini Toolbar Strip */}
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
                                    alt=""
                                    style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'contain' }}
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
                                      readOnly: true,
                                      style: {
                                        fontSize: 11,
                                        fontStyle: 'italic',
                                        textAlign: el.imageAlignment === 'Center' ? 'center' : 'left',
                                        color: '#475569'
                                      }
                                    }}
                                    sx={{ mt: 1 }}
                                  />
                                </Box>
                              </Box>
                            )}

                            {/* ================= TABLE MATRIX ENGINE WITH STRUCTURAL DIMENSION EDITORS ================= */}
                            {el.type === 'table' && (
                              <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                                <Box sx={{ p: 0.5, width: '100%', flexGrow: 1, overflow: 'auto' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                    <tbody>
                                      {el.tableData.map((row, ri) => (
                                        <tr key={ri} style={{ background: ri === 0 ? '#f1f5f9' : 'transparent' }}>
                                          {row.map((cell, ci) => (
                                            <td
                                              key={ci}
                                              style={{
                                                border: '1px solid #cbd5e1',
                                                padding: '2px',
                                                textAlign: 'center',
                                                background: ri === 0 ? '#f1f5f9' : '#ffffff'
                                              }}
                                            >
                                              <input
                                                type="text"
                                                value={cell}
                                                readOnly
                                                style={{
                                                  width: '100%',
                                                  border: 'none',
                                                  background: 'transparent',
                                                  textAlign: 'center',
                                                  fontSize: '11px',
                                                  fontWeight: ri === 0 ? 'bold' : 'normal',
                                                  color: '#334155',
                                                  outline: 'none',
                                                  pointerEvents: 'none'
                                                }}
                                              />
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>

                                  <TextField
                                    fullWidth
                                    variant="standard"
                                    placeholder="Add table index notations summary description data..."
                                    value={el.tableLegend || ''}
                                    InputProps={{
                                      disableUnderline: true,
                                      readOnly: true
                                    }}
                                    inputProps={{
                                      style: {
                                        fontSize: 11,
                                        fontStyle: 'italic',
                                        color: '#64748b',
                                        marginTop: '4px'
                                      }
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                  </Box>

                  {/* Section Level Actions Controls Footer bar */}
                </CardContent>
              </Card>
            ))}
          </Box>
          {commentPopup && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                top: clickedPosition.y,
                width: 340,
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 10px 35px rgba(0,0,0,.22)',
                border: '1px solid #ddd',
                zIndex: 99999,
                overflow: 'hidden'
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 1.5,
                  borderBottom: '1px solid #eee'
                }}
              >
                <Typography fontWeight={700}>Add Comment</Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setCommentPopup(false);
                    setCommentImage(null);
                    setCommentText('');
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ p: 2 }}>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Leave comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Button component="label" startIcon={<AttachFileIcon />}>
                    Image
                    <input
                      hidden
                      type="file"
                      onChange={(e) => {
                        setCommentImage(e.target.files[0]);
                      }}
                    />
                  </Button>

                  <Button
                    variant="contained"
                    onClick={async () => {
                      if (!commentText.trim()) return;

                      try {
                        const formData = new FormData();

                        formData.append('user_id', user._id);
                        formData.append('projectId', id);
                        formData.append('versionId', versionId);
                        formData.append('x', clickedPosition.x);
                        formData.append('y', clickedPosition.y);
                        formData.append('text', commentText);
                        formData.append('createdBy', user?._id);

                        if (commentImage) {
                          formData.append('image', commentImage);
                        }

                        const response = await axios.post(`${REACT_APP_BASE_URL}/reports/report-comments`, formData, {
                          headers: {
                            ...authHeaders,
                            'Content-Type': 'multipart/form-data'
                          }
                        });

                        setComments((prev) => [...prev, response.data]);
                        setCommentPopup(false);
                        setCommentText('');
                        setCommentImage(null);
                        setCommentMode(false);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    ADD COMMENT
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          {comments.map((item, index) => (
            <Tooltip
              key={item._id}
              arrow
              placement="left"
              title={
                <Box>
                  <Typography fontSize={13}>{item.text}</Typography>

                  <Typography fontSize={11} color="gray">
                    Added By: {item.createdBy?.name}
                  </Typography>

                  {item.image && (
                    <img
                      src={item.image}
                      style={{
                        width: 180,
                        marginTop: 10,
                        borderRadius: 6
                      }}
                    />
                  )}
                </Box>
              }
            >
              <Box
                sx={{
                  position: 'absolute',
                  right: activityOpen
                    ? 380 // drawer width + spacing
                    : 20,

                  top: item.y,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor:
                    item.status === 'resolved'
                      ? '#10b981'
                      : item.status === 'in-review'
                        ? '#f59e0b'
                        : item.status === 'rejected'
                          ? '#ef4444'
                          : '#4f46e5',

                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '2px solid white',
                  transform: 'translateY(-50%)',
                  transition: '.25s',
                  '&:hover': {
                    transform: 'translateY(-50%) scale(1.12)'
                  },
                  zIndex: 9999
                }}
                onClick={() => setActivityOpen(true)}
              >
                {index + 1}
              </Box>
            </Tooltip>
          ))}
          {/* ================= 3. RIGHT SIDEBAR WORKSPACE TOOLBOX PANEL ================= */}
        </Box>
        <Drawer
          anchor="right"
          open={activityOpen}
          onClose={() => setActivityOpen(false)}
          PaperProps={{
            sx: {
              width: 420,
              background: '#f8fafc'
            }
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* HEADER */}

            <Box
              sx={{
                p: 2,
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography fontWeight={700} fontSize={18}>
                  Comments Activity
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                  {comments.length} Comments Added
                </Typography>
              </Box>

              <IconButton onClick={() => setActivityOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* TIMELINE */}

            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 3
              }}
            >
              {comments.length === 0 && (
                <Box textAlign="center" mt={15}>
                  <Typography color="text.secondary">No comments added</Typography>
                </Box>
              )}

              {comments.map((item, index) => (
                <Box
                  key={item._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    position: 'relative',
                    pb: 4
                  }}
                >
                  {/* timeline line */}

                  {index !== comments.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 19,
                        top: 40,
                        width: 2,
                        height: '100%',
                        bgcolor: '#e2e8f0'
                      }}
                    />
                  )}

                  {/* Number Circle */}

                  <Box
                    onClick={() => {
                      document.getElementById(`comment-marker-${item._id}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: item.status === 'resolved' ? '#10b981' : '#4f46e5',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Card
                    sx={{
                      ml: 2,
                      flex: 1,
                      borderRadius: 3,
                      boxShadow: '0 2px 10px rgba(0,0,0,.06)',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <CardContent>
                      {/* HEADER */}

                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box>
                          <Typography fontWeight={700} fontSize={13}>
                            Comment #{index + 1}
                          </Typography>

                          <Typography fontSize={11} color="text.secondary">
                            Added By: {item.createdBy?.name || 'Unknown'}
                          </Typography>
                        </Box>

                        <Chip
                          size="small"
                          label={item.status === 'resolved' ? 'Resolved' : 'Open'}
                          color={item.status === 'resolved' ? 'success' : 'warning'}
                        />
                      </Box>

                      {/* COMMENT */}

                      <Typography fontSize={13} lineHeight={1.7} mb={2}>
                        {item.text}
                      </Typography>

                      {/* IMAGE */}

                      {item.image && (
                        <Box mb={2}>
                          <img
                            src={item.image}
                            style={{
                              width: '100%',
                              maxHeight: 220,
                              objectFit: 'cover',
                              borderRadius: 10,
                              border: '1px solid #eee'
                            }}
                          />
                        </Box>
                      )}

                      {/* MANAGER NOTES */}

                      <Box mt={2}>
                        <Typography fontSize={12} fontWeight={700} mb={1}>
                          Manager Notes / Client Change Request
                        </Typography>

                        <Box display="flex" gap={1} alignItems="flex-start">
                          <TextField
                            size="small"
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Add note if client requested modifications..."
                            value={item.managerNote || ''}
                            onChange={(e) =>
                              setComments((prev) =>
                                prev.map((c) =>
                                  c._id === item._id
                                    ? {
                                        ...c,
                                        managerNote: e.target.value
                                      }
                                    : c
                                )
                              )
                            }
                          />

                          <IconButton
                            color="primary"
                            sx={{
                              mt: 0.5,
                              border: '1px solid #ddd'
                            }}
                            onClick={() => updateManagerNote(item._id, item.managerNote)}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* FOOTER */}

                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Typography fontSize={11} color="text.secondary">
                          {new Date(item.createdAt).toLocaleString()}
                        </Typography>

                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            color={item.status === 'resolved' ? 'success' : 'primary'}
                            onClick={() => {
                              updateCommentStatus(item._id, item.status === 'resolved' ? 'open' : 'resolved');
                            }}
                          >
                            {item.status === 'resolved' ? 'REOPEN' : 'RESOLVE'}
                          </Button>

                          <IconButton
                            color="error"
                            onClick={() => {
                              deleteComment(item._id);
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}
