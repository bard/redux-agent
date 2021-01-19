import React from 'react'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

export const TopBar: React.FC = () => (
  <AppBar position='fixed' color='primary'>
    <Toolbar variant='dense'>
      <Box ml={2} mr={3}>
        <img src='https://redux-agent.org/images/logo.svg'
          width={24} height={24} alt='Redux Agent' />
      </Box>
      <Typography variant='body1' style={{ fontWeight: 400 }} color='inherit'>
        <Link href='/' color='inherit'>Redux Agent</Link>
      </Typography>
    </Toolbar>
  </AppBar>
)

export default TopBar
