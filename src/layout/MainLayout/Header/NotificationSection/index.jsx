// ==============================|| FIXED NOTIFICATION SECTION ||============================== //
// ✅ Fixed:
// 1. Correct API import (your current REACT_APP_BASE_URL is wrong)
// 2. notifications.filter safe fix
// 3. Safe socket duplicate prevention
// 4. Safe response parsing
// 5. Safe unread count
// 6. Stable dependencies
// 7. Prevent prev.some crash

import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import socket from 'utils/socket';

// ✅ Correct API import
import  REACT_APP_BASE_URL  from 'utils/api';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconBell } from '@tabler/icons-react';

// ==============================|| STATUS FILTER ||============================== //
const status = [
  { value: 'all', label: 'All Notification' },
  { value: 'new', label: 'New' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' }
];

export default function NotificationSection() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all');

  // ✅ Always array
  const [notifications, setNotifications] = useState([]);

  const anchorRef = useRef(null);

  // ==============================|| USER DATA ||============================== //
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  // ==============================|| FETCH NOTIFICATIONS ||============================== //
  const fetchNotifications = useCallback(async () => {
    try {
      if (!loggedUser?._id) return;

      const res = await axios.get(
        `${REACT_APP_BASE_URL}/notifications/user/${loggedUser._id}`,
        {
          headers: authHeaders
        }
      );

      console.log('Notification API Response:', res.data);

      // ✅ Safe response parsing
      const notificationData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.notifications)
        ? res.data.notifications
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      setNotifications(notificationData);
    } catch (error) {
      console.error('Notification fetch error:', error);
      setNotifications([]);
    }
  }, [loggedUser?._id, token]);

  // ==============================|| SOCKET REGISTER + LIVE UPDATE ||============================== //
  useEffect(() => {
    if (!loggedUser?._id) return;

    socket.emit('registerUser', loggedUser._id);

    const handleNewNotification = (newNotification) => {
      setNotifications((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];

        const exists = safePrev.some(
          (item) => item?._id === newNotification?._id
        );

        if (exists) return safePrev;

        return [newNotification, ...safePrev];
      });
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [loggedUser?._id]);

  // ==============================|| AUTO REFRESH ||============================== //
  useEffect(() => {
    if (!loggedUser?._id) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications, loggedUser?._id]);

  // ==============================|| MARK ALL READ ||============================== //
  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        `${REACT_APP_BASE_URL}/notifications/mark-all-read/${loggedUser._id}`,
        {},
        {
          headers: authHeaders
        }
      );

      setNotifications((prev) =>
        (Array.isArray(prev) ? prev : []).map((item) => ({
          ...item,
          isRead: true,
          isNew: false
        }))
      );
    } catch (error) {
      console.error('Mark all read error:', error);
    }
  };

  // ==============================|| MARK NEW AS SEEN WHEN OPEN ||============================== //
  useEffect(() => {
    if (open) {
      setNotifications((prev) =>
        (Array.isArray(prev) ? prev : []).map((item) => ({
          ...item,
          isNew: false
        }))
      );
    }
  }, [open]);

  // ==============================|| SAFE DATA ||============================== //
  const safeNotifications = Array.isArray(notifications)
    ? notifications
    : [];

  // ==============================|| FILTER ||============================== //
  const filteredNotifications = safeNotifications.filter((item) => {
    switch (value) {
      case 'unread':
        return !item?.isRead;
      case 'read':
        return item?.isRead;
      case 'new':
        return item?.isNew;
      default:
        return true;
    }
  });

  const unreadCount = safeNotifications.filter(
    (item) => !item?.isRead
  ).length;

  // ==============================|| UI HANDLERS ||============================== //
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Box sx={{ ml: 2 }}>
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <Avatar
            variant="rounded"
            ref={anchorRef}
            onClick={handleToggle}
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              cursor: 'pointer',
              transition: 'all .2s ease-in-out',
              color: theme.vars.palette.warning.dark,
              background: theme.vars.palette.warning.light,
              '&:hover': {
                color: theme.vars.palette.warning.light,
                background: theme.vars.palette.warning.dark
              }
            }}
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </Badge>
      </Box>

      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions
              position={downMD ? 'top' : 'top-right'}
              in={open}
              {...TransitionProps}
            >
              <Paper>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                  sx={{ width: 360 }}
                >
                  <Stack sx={{ gap: 2 }}>
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 2,
                        px: 2
                      }}
                    >
                      <Stack direction="row" sx={{ gap: 1 }}>
                        <Typography variant="subtitle1">
                          Notifications
                        </Typography>

                        <Chip
                          size="small"
                          label={unreadCount}
                          variant="filled"
                          color="warning"
                        />
                      </Stack>

                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'primary.main',
                          cursor: 'pointer'
                        }}
                        onClick={handleMarkAllRead}
                      >
                        Mark all read
                      </Typography>
                    </Stack>

                    <Box sx={{ px: 2 }}>
                      <TextField
                        select
                        fullWidth
                        value={value}
                        onChange={handleChange}
                        SelectProps={{ native: true }}
                        size="small"
                      >
                        {status.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        maxHeight: 400,
                        overflowY: 'auto',
                        px: 2
                      }}
                    >
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                          <Box
                            key={notification._id}
                            sx={{
                              py: 1.5,
                              borderBottom: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: notification?.isRead
                                  ? 400
                                  : 700
                              }}
                            >
                              {notification?.message}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {notification?.createdAt
                                ? new Date(
                                    notification.createdAt
                                  ).toLocaleString()
                                : ''}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            py: 3,
                            textAlign: 'center'
                          }}
                        >
                          No notifications found
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <CardActions
                    sx={{
                      p: 1.25,
                      justifyContent: 'center'
                    }}
                  >
                    {/* <Button
                      size="small"
                      component={Link}
                      to="/notifications"
                    >
                      View All
                    </Button> */}
                  </CardActions>
                </MainCard>
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}