import React from 'react'
import Button from '@material-ui/core/Button'

const Action: React.FC<{
  label: String
  onClick(): void
  disabled?: boolean
}> = ({ label, onClick, disabled }) => (
  <Button
    onClick={onClick}
    style={{ marginTop: '0.5rem' }}
    disabled={disabled}
    variant='contained'
    color='primary'
    fullWidth>
    {label}
  </Button>
)

export default Action
