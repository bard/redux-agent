import { diffString as jsonDiff } from 'json-diff'
import React, { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import tomorrowNightEighties from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night-eighties'
import tomorrow from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

interface Props {
  source: string
  title: string
  actions: any
  state: any
  description?: string | React.ReactElement
  referenceUrl: string
}

const RECORDING_DURATION = 3000

const Example: React.FunctionComponent<Props> = ({
  source, actions, title, state, description, referenceUrl
}) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [startRecording, setStartRecording] = useState(-1)
  const [snapshots, setSnapshots] = useState<any[]>([])
  const [snapshotsSeen, setSnapshotsSeen] = useState(false)
  const [agentStateVisible, setAgentStateVisible] = useState(false)

  const handleChange = (_event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex)
  }

  const handleActionClick = () => {
    setSnapshotsSeen(false)
    setStartRecording(Date.now())
    setSnapshots([state])
  }

  if ((Date.now() - startRecording) < RECORDING_DURATION) {
    if (state !== snapshots[snapshots.length - 1]) {
      setSnapshots((prev) => {
        return [...prev, state]
      })
    }
  }

  const showAgentStateCheckbox = (
    <FormControlLabel
      control={
        <Checkbox
          checked={agentStateVisible}
          onChange={
            (e) => setAgentStateVisible(e.currentTarget.checked)}
        />}
      label='Show state slice managed by/reserved to agent' />
  )

  return (
    <Box>
      <Box textAlign='left' mb={2}>
        <Typography variant='h4' color='textSecondary' style={{ fontWeight: 300 }} gutterBottom>
          {title}
        </Typography>

        <Typography variant='body2'>
          {description}
        </Typography>
      </Box>

      <hr />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SectionTitle>Reducer</SectionTitle>
          <Source language='javascript'>{source}</Source>
          <Typography variant='body2' component='p'>
            Find out more about available tasks in the <Link href={referenceUrl}>agent reference</Link>.
          </Typography>

        </Grid>

        <Grid item xs={12} sm={6}>
          <SectionTitle>Actions</SectionTitle>

          <Box pt={1} onClick={handleActionClick}>
            {actions}
          </Box>

          <Typography variant='body2'>
            <em>Tip: open the browser console to see actions as
              they are dispatched.</em>
          </Typography>

          <SectionTitle>State</SectionTitle>

          <Tabs variant='fullWidth' value={tabIndex} onChange={handleChange}>
            <Tab label='Live' />
            <Tab
              onClick={() => setSnapshotsSeen(true)}
              label={(snapshots.length > 0 && !snapshotsSeen)
                ? (<Badge badgeContent={snapshots.length} color='secondary'>Log</Badge>)
                : 'History'} />
          </Tabs>

          {tabIndex === 0 &&
            <>
              {showAgentStateCheckbox}
              <Source language='json'>
                {formatState(normalizeState(state, { agentStateVisible }))}
              </Source>
            </>}

          {tabIndex === 1 && snapshots.length > 0 &&
            <>
              {showAgentStateCheckbox}

              {snapshots.map((s, i) => i === 0
                ? <Source key={i} language='json'>
                  {formatState(normalizeState(s, { agentStateVisible }))}
                </Source>
                : <Source key={i} language='diff'>
                  {jsonDiff(
                    normalizeState(snapshots[i - 1], { agentStateVisible }),
                    normalizeState(s, { agentStateVisible }), { color: false })}
                </Source>)}

              <Source key={snapshots.length} language='json'>
                {formatState(normalizeState(snapshots.slice().pop(),
                  { agentStateVisible }))}
              </Source>
            </>}
        </Grid>
      </Grid>
    </Box>
  )
}

const SectionTitle: React.FC<{}> = ({ children }) => (
  <Box textAlign='center' mt={2}>
    <Typography variant='caption' component='em'>{children}</Typography>
  </Box>
)

const Source: React.FC<{ language: string }> = ({ language, children }) => {
  const materialMkdocsCodehiliteStyle = {
    fontSize: '0.85rem',
    lineHeight: 1.4,
    padding: '0.5rem',
    border: '1px solid #eee'
  }

  const style = language === 'javascript'
    ? tomorrowNightEighties
    : tomorrow

  return (
    <SyntaxHighlighter language={language} style={style}
      customStyle={materialMkdocsCodehiliteStyle}>
      {children}
    </SyntaxHighlighter>
  )
}

const normalizeState = (state: any, opts: { agentStateVisible: boolean }) => {
  let filteredState: any

  if (opts && opts.agentStateVisible) {
    filteredState = state
  } else {
    const { tasks, ...rest } = state
    filteredState = rest
  }

  const normalizedState: any = {}
  Object.keys(filteredState).forEach((key) => {
    normalizedState[key] = filteredState[key]
  })

  return normalizedState
}

const formatState = (state: any) =>
  JSON.stringify(state, null, 2)

export default Example
