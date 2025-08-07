import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Slider,
  TextField,
  Switch as MuiSwitch,
  FormGroup,
  FormControlLabel as MuiFormControlLabel,
  Box as MuiBox,
  Divider as MuiDivider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const sidebarOptions = [
  'General',
  'Standings',
  'Relative',
  'Fuel calculator',
  'Spotter',
  'Pit helper',
  'Inputs',
  'Inputs graph',
  'Traffic indicator',
  'Flatmap',
  'Delta bar',
  'Trackmap',
  'Twitch chat',
];

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    background: {
      default: mode === 'dark' ? '#181c20' : '#f4f6fa',
      paper: mode === 'dark' ? '#23272f' : '#fff',
    },
    primary: {
      main: mode === 'dark' ? '#fff' : '#232a34',
    },
    secondary: {
      main: '#00bfff',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#232a34',
      secondary: mode === 'dark' ? '#b0b8c1' : '#6b7684',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    overline: {
      fontWeight: 700,
      fontSize: '0.8rem',
      letterSpacing: 2,
      color: mode === 'dark' ? '#b0b8c1' : '#6b7684',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#181c20' : '#f4f6fa',
          borderRight: 'none',
          boxShadow: mode === 'dark' ? '2px 0 12px 0 #0004' : '2px 0 12px 0 #b0b8c122',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#00bfff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#00bfff',
              opacity: 0.5,
            },
          },
        },
        track: {
          backgroundColor: mode === 'dark' ? '#4a4a4a' : '#e0e0e0',
        },
        thumb: {
          '&.Mui-checked': {
            backgroundColor: '#00bfff',
          },
        },
      },
    },
  },
});

const drawerWidth = 260;

const defaultRelativeConfig = {
  overlaySize: 14,
  useGeneralSize: true,
  opacity: 75,
  useGeneralOpacity: true,
  showInCar: true,
  showOutCar: true,
  showSpotting: true,
  showGarage: true,
  driversAheadBehind: 4,
  highlightSelected: false,
  showPositionChanges: false,
  forceSameWidth: false,
  showColumnNames: false,
  hideCarsInPit: false,
  showFlags: false,
  // Content columns
  showPosition: true,
  showCountryFlag: true,
  showClassBadgeColor: true,
  showCarNumber: true,
  showDriverName: true,
  showLicense: true,
  showIRating: true,
  showRelativeTime: true,
  showGap: true,
  showFastestLapTime: true,
  showPositionsGained: true,
  showTeamName: false,
  showCarBrand: false,
  showInterval: false,
  showLastLapTime: false,
  showLapDelta: false,
  showPitstopStatus: false,
  showTimeInPitlane: false,
  showTimeInPitbox: false,
  showCurrentStintLength: false,
  showJokerLap: false,
  showTireCompound: false,
  showDriverTags: false,
  showBlackFlag: false,
  showAvg5Laps: false,
  showAvg10Laps: false,
  showPushToPass: false,
  // Header options
  showOverlayTitle: true,
  showTrackName: true,
  showSessionType: true,
  showLapCounter: true,
  showTimeRemaining: true,
  showWeatherInfo: false,
  showCarClassFilter: false,
  showHighlightOwnCar: true,
  showCarNumberHeader: false,
  // Footer options
  showBestLapOverall: false,
  showBestLapOwn: true,
  showLastLapOwn: true,
  showIncidentCountOwn: false,
  showPitInfoOwn: false,
  showCustomMessage: false,
  showLegend: false,
  showTimeOfDay: false,
  showSessionState: false,
  showGapToLeader: false,
  showGapToNextPrev: false,
};

// Estado para las sesiones de cada columna
const defaultSessionConfig = {
  // Position
  showPosition_race: true,
  showPosition_qualy: true,
  showPosition_practice: true,
  // Country flag
  showCountryFlag_race: true,
  showCountryFlag_qualy: true,
  showCountryFlag_practice: true,
  // Class badge color
  showClassBadgeColor_race: true,
  showClassBadgeColor_qualy: true,
  showClassBadgeColor_practice: true,
  // Car number
  showCarNumber_race: true,
  showCarNumber_qualy: true,
  showCarNumber_practice: true,
  // Driver name
  showDriverName_race: true,
  showDriverName_qualy: true,
  showDriverName_practice: true,
  // License
  showLicense_race: true,
  showLicense_qualy: true,
  showLicense_practice: true,
  // iRating
  showIRating_race: true,
  showIRating_qualy: true,
  showIRating_practice: true,
  // Relative time
  showRelativeTime_race: true,
  showRelativeTime_qualy: true,
  showRelativeTime_practice: true,
  // Gap
  showGap_race: true,
  showGap_qualy: true,
  showGap_practice: true,
  // Fastest lap time
  showFastestLapTime_race: true,
  showFastestLapTime_qualy: true,
  showFastestLapTime_practice: true,
  // Positions gained
  showPositionsGained_race: true,
  showPositionsGained_qualy: true,
  showPositionsGained_practice: true,
  // Team name
  showTeamName_race: false,
  showTeamName_qualy: false,
  showTeamName_practice: false,
  // Car brand
  showCarBrand_race: false,
  showCarBrand_qualy: false,
  showCarBrand_practice: false,
  // Interval
  showInterval_race: false,
  showInterval_qualy: false,
  showInterval_practice: false,
  // Last lap time
  showLastLapTime_race: false,
  showLastLapTime_qualy: false,
  showLastLapTime_practice: false,
  // Lap delta
  showLapDelta_race: false,
  showLapDelta_qualy: false,
  showLapDelta_practice: false,
  // Pitstop status
  showPitstopStatus_race: false,
  showPitstopStatus_qualy: false,
  showPitstopStatus_practice: false,
  // Time in pitlane
  showTimeInPitlane_race: false,
  showTimeInPitlane_qualy: false,
  showTimeInPitlane_practice: false,
  // Time in pitbox
  showTimeInPitbox_race: false,
  showTimeInPitbox_qualy: false,
  showTimeInPitbox_practice: false,
  // Current stint length
  showCurrentStintLength_race: false,
  showCurrentStintLength_qualy: false,
  showCurrentStintLength_practice: false,
  // Joker lap
  showJokerLap_race: false,
  showJokerLap_qualy: false,
  showJokerLap_practice: false,
  // Tire compound
  showTireCompound_race: false,
  showTireCompound_qualy: false,
  showTireCompound_practice: false,
  // Driver tags
  showDriverTags_race: false,
  showDriverTags_qualy: false,
  showDriverTags_practice: false,
  // Black flag
  showBlackFlag_race: false,
  showBlackFlag_qualy: false,
  showBlackFlag_practice: false,
  // AVG 5 laps
  showAvg5Laps_race: false,
  showAvg5Laps_qualy: false,
  showAvg5Laps_practice: false,
  // AVG 10 laps
  showAvg10Laps_race: false,
  showAvg10Laps_qualy: false,
  showAvg10Laps_practice: false,
  // Push to pass
  showPushToPass_race: false,
  showPushToPass_qualy: false,
  showPushToPass_practice: false,
};

function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

interface RelativeConfigPanelProps { mode: 'light' | 'dark'; }
const RelativeConfigPanel: React.FC<RelativeConfigPanelProps> = ({ mode }) => {
  const [tab, setTab] = React.useState<number>(0);
  const [config, setConfig] = useLocalStorageState<typeof defaultRelativeConfig>('relativeConfig', defaultRelativeConfig);
  const [sessionConfig, setSessionConfig] = useLocalStorageState<typeof defaultSessionConfig>('relativeSessionConfig', defaultSessionConfig);
  const [visible, setVisible] = React.useState(() => {
    const stored = localStorage.getItem('relativeVisible');
    return stored ? JSON.parse(stored) : true;
  });
  

  
  React.useEffect(() => {
    localStorage.setItem('relativeVisible', JSON.stringify(visible));
  }, [visible]);

  // Sincronización inicial de switches principales basada en las sesiones
  React.useEffect(() => {
    const contentKeys = [
      'showPosition', 'showCountryFlag', 'showClassBadgeColor', 'showCarNumber', 'showDriverName', 'showLicense',
      'showIRating', 'showRelativeTime', 'showGap', 'showFastestLapTime', 'showPositionsGained', 'showTeamName',
      'showCarBrand', 'showInterval', 'showLastLapTime', 'showLapDelta', 'showPitstopStatus', 'showTimeInPitlane',
      'showTimeInPitbox', 'showCurrentStintLength', 'showJokerLap', 'showTireCompound', 'showDriverTags',
      'showBlackFlag', 'showAvg5Laps', 'showAvg10Laps', 'showPushToPass'
    ];
    
    const updatedConfig = { ...config };
    let hasChanges = false;
    
    contentKeys.forEach(key => {
      const allSessions = ['race', 'qualy', 'practice'];
      const hasActiveSession = allSessions.some(session => {
        const sessionKey = `${key}_${session}` as keyof typeof sessionConfig;
        return sessionConfig[sessionKey];
      });
      
      if (hasActiveSession && !updatedConfig[key as keyof typeof updatedConfig]) {
        (updatedConfig as any)[key] = true;
        hasChanges = true;
      } else if (!hasActiveSession && updatedConfig[key as keyof typeof updatedConfig]) {
        (updatedConfig as any)[key] = false;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setConfig(updatedConfig);
    }
  }, [sessionConfig, config]);

  // Handler para switches
  const handleSwitch = (field: keyof typeof defaultRelativeConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [field]: event.target.checked,
    });
  };

  // Handler para inputs numéricos/texto
  const handleInput = (field: keyof typeof defaultRelativeConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
    setConfig({
      ...config,
      [field]: value,
    });
  };

  return (
    <MuiBox
      sx={{
        width: '100%',
        maxWidth: 900,
        px: { xs: 1, sm: 3 },
        pt: 0,
        mt: 0,
        minWidth: 0,
        overflowX: 'auto',
        alignSelf: 'stretch',
        bgcolor: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
         <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700, flexGrow: 1 }}>
           Relative
         </Typography>
         <FormControlLabel
           control={<Switch checked={visible} onChange={e => setVisible(e.target.checked)} color="primary" />}
           label="Visible"
           sx={{ ml: 2 }}
         />
         
       </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        The relative overlay show the other drivers around you.
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          '.MuiTab-root': {
            fontWeight: 500,
            minHeight: 36,
            minWidth: 90,
            borderRadius: 0,
            background: 'none',
            px: 3,
            py: 0,
            transition: 'background 0.2s',
            position: 'relative',
            zIndex: 1,
          },
          '.Mui-selected': {
            color: '#232a34',
            background: 'none',
            fontWeight: 700,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '100%',
              pointerEvents: 'none',
              borderRadius: 0,
              background: 'linear-gradient(to top, #2196f3aa 1%, transparent 89%)',
              zIndex: -1,
            },
          },
          '.MuiTabs-indicator': {
            backgroundColor: '#2196f3',
            height: 5,
            borderRadius: 0,
            bottom: 0,
            marginBottom: '-2px',
          },
        }}
      >
        <Tab label="General" sx={{ minWidth: 90 }} />
        <Tab label="Content" sx={{ minWidth: 90 }} />
        <Tab label="Header" sx={{ minWidth: 90 }} />
        <Tab label="Footer" sx={{ minWidth: 90 }} />
      </Tabs>
      <MuiDivider sx={{ my: 2 }} />
      {tab === 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Size and visibility</Typography>
          <MuiBox sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Overlay size"
              type="number"
              size="small"
              value={config.overlaySize}
              onChange={handleInput('overlaySize')}
              sx={{ width: { xs: 80, sm: 80 }, flex: '1 1 80px', minWidth: 0 }}
              inputProps={{ min: 8, max: 40 }}
            />
            <MuiFormControlLabel
              control={<MuiSwitch checked={config.useGeneralSize} onChange={handleSwitch('useGeneralSize')} />}
              label="Use general"
              sx={{ flex: '1 1 120px', minWidth: 0 }}
            />
            <TextField
              label="Opacity"
              type="number"
              size="small"
              value={config.opacity}
              onChange={handleInput('opacity')}
              sx={{ width: { xs: 80, sm: 80 }, flex: '1 1 80px', minWidth: 0 }}
              inputProps={{ min: 10, max: 100 }}
            />
            <MuiFormControlLabel
              control={<MuiSwitch checked={config.useGeneralOpacity} onChange={handleSwitch('useGeneralOpacity')} />}
              label="Use general"
              sx={{ flex: '1 1 120px', minWidth: 0 }}
            />
          </MuiBox>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Show overlay when</Typography>
          <FormGroup row sx={{ mb: 2, flexWrap: 'wrap' }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.showInCar} onChange={handleSwitch('showInCar')} />} label="In car" sx={{ flex: '1 1 120px', minWidth: 0 }} />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showOutCar} onChange={handleSwitch('showOutCar')} />} label="Out of car" sx={{ flex: '1 1 140px', minWidth: 0 }} />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showSpotting} onChange={handleSwitch('showSpotting')} />} label="Spotting" sx={{ flex: '1 1 120px', minWidth: 0 }} />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showGarage} onChange={handleSwitch('showGarage')} />} label="In garage" sx={{ flex: '1 1 120px', minWidth: 0 }} />
          </FormGroup>
          <MuiDivider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Overlay specific</Typography>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Drivers ahead/behind"
              type="number"
              size="small"
              value={config.driversAheadBehind}
              onChange={handleInput('driversAheadBehind')}
              sx={{ width: { xs: 80, sm: 80 }, flex: '1 1 80px', minWidth: 0 }}
              inputProps={{ min: 1, max: 20 }}
            />
          </MuiBox>
          <FormGroup sx={{ flexDirection: 'column', gap: 1, flexWrap: 'nowrap', mt: 1 }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.highlightSelected} onChange={handleSwitch('highlightSelected')} />} label="Highlight background color for selected driver" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showPositionChanges} onChange={handleSwitch('showPositionChanges')} />} label="Show live position changes" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.forceSameWidth} onChange={handleSwitch('forceSameWidth')} />} label="Force same window width for all sessions" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showColumnNames} onChange={handleSwitch('showColumnNames')} />} label="Show column names" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.hideCarsInPit} onChange={handleSwitch('hideCarsInPit')} />} label="Hide cars in pit box" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showFlags} onChange={handleSwitch('showFlags')} />} label="Show flags" />
          </FormGroup>
        </>
      )}
             {tab === 1 && (
         <MuiBox sx={{ p: 2, color: 'text.secondary' }}>
           <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>Content columns</Typography>
           
                       {/* Content items with switches and session checkboxes */}
            {[
              { key: 'showPosition', label: 'Position', hasSettings: true },
              { key: 'showCountryFlag', label: 'Country flag', hasSettings: false },
              { key: 'showClassBadgeColor', label: 'Class badge color', hasSettings: false },
              { key: 'showCarNumber', label: 'Car number', hasSettings: true },
              { key: 'showDriverName', label: 'Driver name', hasSettings: true },
              { key: 'showLicense', label: 'License', hasSettings: true },
              { key: 'showIRating', label: 'iRating', hasSettings: true },
              { key: 'showRelativeTime', label: 'Relative time', hasSettings: true },
              { key: 'showGap', label: 'Gap', hasSettings: true },
              { key: 'showFastestLapTime', label: 'Fastest lap time', hasSettings: true },
              { key: 'showPositionsGained', label: 'Positions gained', hasSettings: false },
              { key: 'showTeamName', label: 'Team name', hasSettings: true },
              { key: 'showCarBrand', label: 'Car brand', hasSettings: true },
              { key: 'showInterval', label: 'Interval', hasSettings: true },
              { key: 'showLastLapTime', label: 'Last lap time', hasSettings: true },
              { key: 'showLapDelta', label: 'Lap delta', hasSettings: true },
              { key: 'showPitstopStatus', label: 'Pitstop status', hasSettings: false },
              { key: 'showTimeInPitlane', label: 'Time in pitlane', hasSettings: false },
              { key: 'showTimeInPitbox', label: 'Time in pitbox', hasSettings: false },
              { key: 'showCurrentStintLength', label: 'Current stint length', hasSettings: false },
              { key: 'showJokerLap', label: 'Joker lap', hasSettings: false },
              { key: 'showTireCompound', label: 'Tire compound', hasSettings: false },
              { key: 'showDriverTags', label: 'Driver tags', hasSettings: false },
              { key: 'showBlackFlag', label: 'Black flag', hasSettings: false },
              { key: 'showAvg5Laps', label: 'AVG 5 laps', hasSettings: false },
              { key: 'showAvg10Laps', label: 'AVG 10 laps', hasSettings: false },
              { key: 'showPushToPass', label: 'Push to pass', hasSettings: false },
            ].map((item, index) => (
             <Box key={item.key} sx={{ 
               display: 'flex', 
               alignItems: 'center', 
               py: 2,
               px: 2,
                               borderBottom: index < 27 ? '1px solid' : 'none',
               borderColor: mode === 'dark' ? '#333' : '#e0e0e0',
               '&:hover': {
                 backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
               },
             }}>
                               {/* Toggle Switch */}
                                 <Box 
                                       onClick={() => {
                      setConfig(prevConfig => {
                        const newValue = !prevConfig[item.key as keyof typeof prevConfig];
                        
                        // Si se está activando el switch principal, activar al menos una sesión si no hay ninguna
                        if (newValue) {
                          const allSessions = ['race', 'qualy', 'practice'];
                          const hasActiveSession = allSessions.some(session => {
                            const key = `${item.key}_${session}` as keyof typeof sessionConfig;
                            return sessionConfig[key];
                          });
                          
                          if (!hasActiveSession) {
                            // Activar la primera sesión (race) por defecto
                            setSessionConfig(prevSessionConfig => ({
                              ...prevSessionConfig,
                              [`${item.key}_race`]: true
                            }));
                          }
                        }
                        
                        return {
                          ...prevConfig,
                          [item.key]: newValue
                        };
                      });
                    }}
                  sx={{ 
                    position: 'relative',
                    width: 48,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: config[item.key as keyof typeof config] ? '#00bfff' : (mode === 'dark' ? '#4a4a4a' : '#e0e0e0'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    mr: 3,
                  }}
                >
                  {/* Thumb */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 2,
                    left: config[item.key as keyof typeof config] ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease',
                  }} />
                </Box>
                
                {/* Label */}
                <Typography sx={{ 
                  flexGrow: 1, 
                  color: mode === 'dark' ? '#fff' : '#000',
                  fontWeight: config[item.key as keyof typeof config] ? 500 : 400,
                  fontSize: '0.9rem',
                }}>
                  {item.label}
                </Typography>
                
                {/* Settings link */}
                {item.hasSettings && (
                  <Typography sx={{ 
                    color: '#00bfff',
                    fontSize: '0.8rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    mr: 2,
                    '&:hover': {
                      color: '#0099cc',
                    },
                  }}>
                    settings
                  </Typography>
                )}
                
                {/* Session Checkboxes */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['race', 'qualy', 'practice'].map((session) => {
                    const sessionKey = `${item.key}_${session}` as keyof typeof sessionConfig;
                    const isEnabled = sessionConfig[sessionKey];
                    
                    return (
                      <Box key={session} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                 <Box 
                                                       onClick={() => {
                              setSessionConfig(prevConfig => {
                                const newConfig = {
                                  ...prevConfig,
                                  [sessionKey]: !prevConfig[sessionKey]
                                };
                                
                                // Verificar si todos los checkboxes están desactivados
                                const allSessions = ['race', 'qualy', 'practice'];
                                const allDisabled = allSessions.every(session => {
                                  const key = `${item.key}_${session}` as keyof typeof sessionConfig;
                                  return !newConfig[key];
                                });
                                
                                // Si todos están desactivados, desactivar el switch principal
                                if (allDisabled) {
                                  setConfig(prevConfig => ({
                                    ...prevConfig,
                                    [item.key]: false
                                  }));
                                }
                                
                                return newConfig;
                              });
                            }}
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: 0, // Cuadrado
                            backgroundColor: isEnabled ? '#00bfff' : 'transparent',
                            border: '2px solid',
                            borderColor: isEnabled ? '#00bfff' : (mode === 'dark' ? '#666' : '#ccc'),
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: isEnabled ? '#0099cc' : '#999',
                            },
                          }}
                        >
                          {/* Checkmark */}
                          {isEnabled && (
                            <Box sx={{
                              width: 8,
                              height: 8,
                              backgroundColor: '#000',
                              borderRadius: 0, // Cuadrado
                            }} />
                          )}
                        </Box>
                        <Typography sx={{ 
                          fontSize: '0.8rem', 
                          color: mode === 'dark' ? '#fff' : '#000',
                          textTransform: 'capitalize',
                          fontWeight: 400
                        }}>
                          {session}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
             </Box>
           ))}
         </MuiBox>
       )}
      {tab === 2 && (
        <MuiBox sx={{ p: 2, color: 'text.secondary' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Header options</Typography>
          <FormGroup sx={{ flexDirection: 'column', gap: 1 }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.showOverlayTitle} onChange={handleSwitch('showOverlayTitle')} />} label="Overlay title" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showTrackName} onChange={handleSwitch('showTrackName')} />} label="Track name" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showSessionType} onChange={handleSwitch('showSessionType')} />} label="Session type (Race, Qualy, Practice)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLapCounter} onChange={handleSwitch('showLapCounter')} />} label="Lap counter (current/total)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showTimeRemaining} onChange={handleSwitch('showTimeRemaining')} />} label="Time remaining" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showWeatherInfo} onChange={handleSwitch('showWeatherInfo')} />} label="Weather info" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarClassFilter} onChange={handleSwitch('showCarClassFilter')} />} label="Car class filter" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showHighlightOwnCar} onChange={handleSwitch('showHighlightOwnCar')} />} label="Show your own car highlighted" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarNumberHeader} onChange={handleSwitch('showCarNumberHeader')} />} label="Show car number in header" />
          </FormGroup>
        </MuiBox>
      )}
      {tab === 3 && (
        <MuiBox sx={{ p: 2, color: 'text.secondary' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Footer options</Typography>
          <FormGroup sx={{ flexDirection: 'column', gap: 1 }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.showBestLapOverall} onChange={handleSwitch('showBestLapOverall')} />} label="Best lap (overall)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showBestLapOwn} onChange={handleSwitch('showBestLapOwn')} />} label="Best lap (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLastLapOwn} onChange={handleSwitch('showLastLapOwn')} />} label="Last lap (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showIncidentCountOwn} onChange={handleSwitch('showIncidentCountOwn')} />} label="Incident count (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showPitInfoOwn} onChange={handleSwitch('showPitInfoOwn')} />} label="Pit info (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCustomMessage} onChange={handleSwitch('showCustomMessage')} />} label="Custom message" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLegend} onChange={handleSwitch('showLegend')} />} label="Show legend (icon meanings)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showTimeOfDay} onChange={handleSwitch('showTimeOfDay')} />} label="Show time of day" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showSessionState} onChange={handleSwitch('showSessionState')} />} label="Show session state (green, yellow, checkered)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showGapToLeader} onChange={handleSwitch('showGapToLeader')} />} label="Show gap to leader" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showGapToNextPrev} onChange={handleSwitch('showGapToNextPrev')} />} label="Show gap to next/previous" />
          </FormGroup>
        </MuiBox>
      )}
    </MuiBox>
  );
};

const App: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = getTheme(mode);
  const muiTheme = useTheme();
  const isSm = useMediaQuery(muiTheme.breakpoints.down('sm'));

  useEffect(() => {
    if (mode === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [mode]);

  const drawer = (
    <Box sx={{ px: { xs: 1, sm: 2.5 }, pb: 2 }}>
                    <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          pt: 1, 
          mb: 1,
          pl: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              Switch theme
            </Typography>
            <Box 
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              sx={{ 
                position: 'relative',
                width: 48,
                height: 24,
                borderRadius: 12,
                backgroundColor: mode === 'dark' ? '#00bfff' : '#e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#0099cc' : '#d0d0d0',
                },
              }}
            >
              {/* Thumb */}
              <Box sx={{ 
                position: 'absolute',
                top: 2,
                left: mode === 'dark' ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: mode === 'dark' ? '#fff' : '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
              }} />
            </Box>
          </Box>
        </Box>
      <Typography variant="overline" sx={{ mb: 1, display: 'block', letterSpacing: 2, fontWeight: 700, color: theme.palette.text.secondary }}>
        OVERLAYS
      </Typography>
      <Divider sx={{ mb: 1, background: mode === 'dark' ? '#2c3440' : '#e0e3e7' }} />
      <List sx={{ mt: 1 }}>
        {sidebarOptions.map((text, idx) => (
          <ListItemButton
            key={text}
            selected={selected === idx}
            onClick={() => {
              setSelected(idx);
              setMobileOpen(false);
            }}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              px: 2,
              py: 1.2,
              color: selected === idx ? (mode === 'dark' ? '#fff' : '#232a34') : theme.palette.text.primary,
              backgroundColor: selected === idx ? '#2196f3 !important' : 'transparent',
              fontWeight: selected === idx ? 700 : 400,
              boxShadow: 'none',
              transition: 'background 0.2s, color 0.2s',
              '&:hover': {
                backgroundColor: selected === idx ? '#1769aa' : (mode === 'dark' ? '#232a34' : '#e3e8f0'),
              },
            }}
          >
            <ListItemText
              primary={text}
              primaryTypographyProps={{ fontWeight: selected === idx ? 700 : 400 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Sidebar responsive */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                pt: 3,
                px: 0,
                backgroundColor: theme.palette.background.paper,
                transition: 'background 0.3s',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 0, sm: 0 }, backgroundColor: 'background.default', position: 'relative', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {/* Top bar for mobile */}
          {isSm && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" color="primary" sx={{ flexGrow: 1 }}>
                iArsim
              </Typography>
            </Box>
          )}
          {selected === 2 ? (
            <RelativeConfigPanel mode={mode} />
          ) : (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
              <Card sx={{ minWidth: 0, width: { xs: '100%', sm: 340, md: 420 }, flex: 1, boxShadow: 2, mb: 3, backgroundColor: mode === 'dark' ? '#23272f' : '#f4f6fa', border: 'none' }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Welcome to iArsim
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select an option from the menu to get started. Here you can see overlays and widgets with real-time iRacing data.
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 0, width: { xs: '100%', sm: 340, md: 420 }, flex: 1, boxShadow: 2, mb: 3, backgroundColor: mode === 'dark' ? '#23272f' : '#f4f6fa', border: 'none' }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Widget example
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Here you can show recent results, activity, or any other relevant data.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 