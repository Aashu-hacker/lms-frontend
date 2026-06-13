import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import MainCard from 'ui-component/cards/MainCard';
import REACT_APP_BASE_URL from 'utils/api';

import Swal from 'sweetalert2';

import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Avatar,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { IconArchive } from '@tabler/icons-react';
import { IconBell } from '@tabler/icons-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

import { ArrowBack, CalendarMonth, Person, Layers, Notifications, Archive, Edit, Science, Groups } from '@mui/icons-material';

export default function ViewProjectVersions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  };

  const user = getUser();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [versions, setVersions] = useState([]);
  const [creatingVersion, setCreatingVersion] = useState(false);
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false);

  useEffect(() => {
    fetchVersionDetails();
  }, [id]);

  const fetchVersionDetails = async () => {
    try {
      setLoading(true);

      const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.get(`${REACT_APP_BASE_URL}/projects/${id}/versions`, {
        headers: authHeaders
      });

      setProject(res.data?.project);
      setVersions(res.data?.data || []);
    } catch (error) {
      console.error(error?.response?.data?.message || 'Failed to fetch project version details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewVersion = async () => {
    try {
      const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      // ================= API CALL =================
      const res = await axios.post(`${REACT_APP_BASE_URL}/projects/${id}/versions`, {}, { headers: authHeaders });

      setShowCreateVersionModal(false);

      // ================= REFRESH DATA =================
      await fetchVersionDetails();

      // ================= SUCCESS ALERT =================
      await Swal.fire({
        title: 'Version Created Successfully!',
        html: `
        <div style="text-align:left;">
          <p><b>Project:</b> ${res.data.project?.title || 'N/A'}</p>
          <p><b>Base Version:</b> ${
            res.data.baseVersion ? `v${res.data.baseVersion.version} (${res.data.baseVersion.status})` : 'Initial Version'
          }</p>
          <p><b>New Version:</b> v${res.data.newVersion.version}</p>
          <p><b>Status:</b> ${res.data.newVersion.status}</p>
          <p><b>Cloned Blocks:</b> ${res.data.clonedBlocks}</p>
        </div>
      `,
        icon: 'success',
        confirmButtonColor: '#6366f1'
      });

      // ================= OPTIONAL REDIRECT =================
      // navigate(`/admin/projects/${id}/versions/${res.data.newVersion._id}`);
    } catch (error) {
      console.error(error?.response?.data?.message || 'Failed to create new version');

      // ================= ERROR ALERT =================
      Swal.fire({
        title: 'Version Creation Failed',
        text: error?.response?.data?.message || 'Something went wrong while creating the new version.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setCreatingVersion(false);
    }
  };

  // ================= ACTION FUNCTIONS =================
  const handleDeleteVersion = async (versionId, versionNumber) => {
    const result = await Swal.fire({
      title: `Delete Version v${versionNumber}?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete'
    });

    if (!result.isConfirmed) return;

    try {
      const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`${REACT_APP_BASE_URL}/projects/${id}/versions/${versionId}`, { headers: authHeaders });

      await fetchVersionDetails();

      Swal.fire('Deleted!', `Version v${versionNumber} deleted successfully`, 'success');
    } catch (error) {
      Swal.fire('Failed!', error?.response?.data?.message || 'Failed to delete version', 'error');
    }
  };

  const handleArchiveVersion = async (versionId, versionNumber) => {
    const result = await Swal.fire({
      title: `Archive Version v${versionNumber}?`,
      text: 'This version will be moved to archived state.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'Yes, Archive'
    });

    if (!result.isConfirmed) return;

    try {
      const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      await axios.put(`${REACT_APP_BASE_URL}/projects/${id}/versions/${versionId}/archive`, {}, { headers: authHeaders });

      await fetchVersionDetails();

      Swal.fire('Archived!', `Version v${versionNumber} archived successfully`, 'success');
    } catch (error) {
      Swal.fire('Failed!', error?.response?.data?.message || 'Failed to archive version', 'error');
    }
  };

  const handleNotifyVersion = async (versionId, versionNumber) => {
    const result = await Swal.fire({
      title: `Notify Admin for v${versionNumber}?`,
      text: 'Admin will be notified that this draft is ready.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Yes, Notify'
    });

    if (!result.isConfirmed) return;

    try {
      const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      await axios.put(`${REACT_APP_BASE_URL}/projects/${id}/versions/${versionId}/notify`, {}, { headers: authHeaders });

      await fetchVersionDetails();

      Swal.fire('Notified!', `Admin notified for Version v${versionNumber}`, 'success');
    } catch (error) {
      Swal.fire('Failed!', error?.response?.data?.message || 'Failed to notify admin', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h3">Project Version not found</Typography>

        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  const latestVersion = versions[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'secondary';
      case 'submitted for review':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getColor = (status) => {
    switch (status) {
      case 'published':
        return 'primary';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ p: 4, background: '#f8fafc', minHeight: '100vh' }}>
      {/* ================= BACK ================= */}
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 4 }}>
        Back to Projects
      </Button>
      {/* ================= HERO SECTION ================= */}
      <MainCard
        sx={{
          mb: 4,
          borderRadius: 4,
          color: '#fff',
          background: 'linear-gradient(90deg,rgba(84, 51, 255, 1) 0%, rgba(32, 189, 255, 1) 35%, rgba(165, 254, 203, 1) 100%)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="overline" sx={{ opacity: 0.8 }}>
                PROJECT VERSION MANAGEMENT
              </Typography>

              <Typography variant="h2" fontWeight={700} gutterBottom>
                {project.title || 'Untitled Project'}
              </Typography>

              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {project.shortDescription || 'No description available'}
              </Typography>

              <Stack direction="row" spacing={1} mt={3} flexWrap="wrap">
                <Chip label={project.projectId} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />

                <Chip label={`Latest v${latestVersion?.version || 1}`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />

                <Chip
                  label={latestVersion?.status ? latestVersion.status.charAt(0).toUpperCase() + latestVersion.status.slice(1) : 'Draft'}
                  color={getStatusColor(latestVersion?.status)}
                />
                 {latestVersion?.isNotify && (
                  <Chip icon={<Notifications />} sx={{ bgcolor: 'rgba(255,255,255,0.15)' },{fontWeight: '900'}} label="Admin Notified" color="success" />
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                {!(user?.role === 'manager') && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    startIcon={<AddIcon />}
                    onClick={() => setShowCreateVersionModal(true)}
                  >
                    Create New Draft Version
                  </Button>
                )}

                {!(user?.role === 'manager') && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ color: '#fff' }}
                    color="secondary"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/admin/projects/${id}/versions/${latestVersion._id}`)}
                  >
                    Edit Version
                  </Button>
                )}
                {user?.role !== 'admin' && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ color: '#fff' }}
                    color="success"
                    startIcon={<Notifications />}
                    onClick={() => handleNotifyVersion(latestVersion._id, latestVersion.version)}
                  >
                    Notify Admin
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                  startIcon={<Archive />}
                  onClick={() => handleArchiveVersion(latestVersion._id, latestVersion.version)}
                >
                  Archive
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </MainCard>
      {/* ================= MAIN GRID ================= */}
      <Grid container spacing={4}>
        {/* LEFT SIDE */}
        <Grid item xs={12} lg={8}>
          {/* VERSION HISTORY */}
          <MainCard title="Version History" sx={{ mb: 4, borderRadius: 4 }}>
            <Stack spacing={3}>
              {versions.map((version) => (
                <Paper
                  key={version._id}
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  {/* // ================= UPDATED GRID ================= */}
                  {!(
                    user?.role === 'manager' &&
                    version.status !== 'submitted for review' &&
                    version.status == 'sent_back' &&
                    version.status !== 'approved for client review'
                  ) && (
                    <Grid container spacing={3} alignItems="center">
                      {/* VERSION */}
                      <Grid item xs={12} md={2}>
                        <Typography variant="h4">v{version.version}</Typography>

                        <Chip
                          label={version?.status ? version.status.charAt(0).toUpperCase() + version.status.slice(1) : 'Draft'}
                          color={getStatusColor(version.status)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Grid>

                      {/* CREATED */}
                      <Grid item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Created
                        </Typography>

                        <Typography>{new Date(version.createdAt).toLocaleDateString()}</Typography>
                      </Grid>

                      {/* UPDATED BY */}
                      <Grid item xs={12} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Updated By
                        </Typography>

                        <Typography>{version.updatedBy?.name || 'N/A'}</Typography>
                      </Grid>

                      {/* VIEW */}
                      <Grid item xs={12} md={2}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            navigate(
                              user?.role === 'manager'
                                ? `/manager/reports/add-comment/${id}/versions/${version._id}`
                                : `/admin/projects/${id}/versions/${version._id}`
                            )
                          }
                        >
                          View
                        </Button>
                      </Grid>

                      {/* ACTIONS */}
                      <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {/* Notify - hide for version manager */}
                          {version.status === 'draft' && !version.isNotify && user?.role !== 'admin' && user?.role !== 'manager' && (
                            <Button
                              size="small"
                              color="success"
                              variant="outlined"
                              startIcon={<IconBell />}
                              onClick={() => handleNotifyVersion(version._id, version.version)}
                            >
                              Notify
                            </Button>
                          )}

                          {/* Archive - allowed for version manager */}
                          {version.status !== 'archived' && (
                            <Button
                              size="small"
                              color="secondary"
                              variant="outlined"
                              startIcon={<IconArchive />}
                              onClick={() => handleArchiveVersion(version._id, version.version)}
                            >
                              Archive
                            </Button>
                          )}

                          {/* Delete - hide for version manager */}
                          {user?.role !== 'manager' && (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteVersion(version._id, version.version)}
                            >
                              Delete
                            </Button>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              ))}
            </Stack>
          </MainCard>

          {/* SCIENTIFIC WORKFLOW */}
          <MainCard title="Scientific Workflow" sx={{ borderRadius: 4 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {project.ngsApplications?.length > 0 ? (
                project.ngsApplications.map((app, idx) => (
                  <Chip key={idx} icon={<Science />} label={app.label || app.value || app} color="primary" variant="outlined" />
                ))
              ) : (
                <Typography color="text.secondary">No NGS applications assigned</Typography>
              )}
            </Stack>
          </MainCard>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} lg={4}>
          {/* TEAM */}
          <MainCard title="Team Assignment" sx={{ mb: 4, borderRadius: 4 }}>
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Manager
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>
                  <Person />
                </Avatar>

                <Box>
                  <Typography>{project.manager?.name || 'No manager assigned'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.manager?.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Analysts
            </Typography>

            <Stack spacing={2}>
              {project.analysts?.length > 0 ? (
                project.analysts.map((analyst) => (
                  <Stack key={analyst._id} direction="row" spacing={2}>
                    <Avatar>
                      <Groups />
                    </Avatar>

                    <Box>
                      <Typography>{analyst.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {analyst.email}
                      </Typography>
                    </Box>
                  </Stack>
                ))
              ) : (
                <Typography color="text.secondary">No analysts assigned</Typography>
              )}
            </Stack>
          </MainCard>

          {/* METADATA */}
          <MainCard title="Version Metadata" sx={{ borderRadius: 4 }}>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Total Versions</Typography>
                <Typography fontWeight={600}>{versions.length}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Latest Version</Typography>
                <Typography fontWeight={600}>v{latestVersion?.version}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Project Status</Typography>
                <Typography fontWeight={600}>{project.status || 'Active'}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Due Date</Typography>
                <Typography fontWeight={600}>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</Typography>
              </Box>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
      {/* // ================= CREATE VERSION CONFIRM MODAL ================= */}
      <Dialog open={showCreateVersionModal} onClose={() => setShowCreateVersionModal(false)} maxWidth="sm" fullWidth>
        {' '}
        <DialogTitle>Create New Project Version</DialogTitle>{' '}
        <DialogContent>
          {' '}
          <Typography variant="body1" sx={{ mb: 2 }}>
            {' '}
            This will create a new <strong>draft version</strong> from:{' '}
          </Typography>{' '}
          <Typography variant="body2" color="text.secondary">
            {' '}
            • Latest Published Version (priority) <br /> • Latest Draft Version (fallback) <br /> • All blocks, figures, tables and content
            will be cloned{' '}
          </Typography>{' '}
          <Typography sx={{ mt: 3 }}>
            {' '}
            New version will become: <strong> v{(versions?.[0]?.version || 0) + 1}</strong>{' '}
          </Typography>{' '}
        </DialogContent>{' '}
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {' '}
          <Button onClick={() => setShowCreateVersionModal(false)} color="inherit">
            {' '}
            Cancel{' '}
          </Button>{' '}
          <Button
            variant="contained"
            color="warning"
            onClick={handleCreateNewVersion}
            disabled={creatingVersion}
            startIcon={creatingVersion ? <CircularProgress size={18} /> : <AddIcon />}
          >
            {' '}
            {creatingVersion ? 'Creating...' : 'Create Version'}{' '}
          </Button>{' '}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
