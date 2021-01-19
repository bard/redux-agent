import React from 'react'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
    position: 'sticky',
    top: theme.spacing(8),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      position: 'static'
    }
  },

  header: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },

  list: {
    padding: 0,
    margin: 0,
    listStyleType: 'none',
    '& > li': {
      marginBottom: theme.spacing(1)
    },
    '& > li > ul': {
      paddingLeft: theme.spacing(1)
    }
  },

  back: {
    '&:before': {
      content: '"←"',
      display: 'inline-block',
      position: 'absolute',
      left: '-1rem',
    }
  }
}))

const TableOfContents: React.FunctionComponent<{
  sections: { [href: string]: string },
  current: string
}> = ({ sections, current }) => {
  const classes = useStyles()

  return (
    <nav className={classes.root}>
      <Typography variant='body2' component='ul' className={classes.list}>
        <li className={classes.back}>
          <Link href='/' color='inherit'>Back to Docs</Link>
        </li>

        <li>Examples</li>

        <li>
          <Typography variant='body2' component='ul' className={classes.list}>
            {Object.entries(sections).map(([href, title]) => (
              <li key={href}>
                <Link href={href}
                  color={href === current ? 'primary' : 'inherit'}>
                  {title}
                </Link>
              </li>
            ))}
          </Typography>
        </li>
      </Typography>
    </nav>
  )
}

export default TableOfContents
