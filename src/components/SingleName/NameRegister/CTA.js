import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'

import { COMMIT, REGISTER } from '../../../graphql/mutations'

import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'
import { ReactComponent as DefaultPencil } from '../../Icons/SmallPencil.svg'

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Pencil = styled(DefaultPencil)`
  margin-right: 5px;
`

const Prompt = styled('span')`
  color: #ffa600;
  margin-right: 10px;
`

function getCTA({
  step,
  incrementStep,
  duration,
  label,
  txHash,
  setTxHash,
  setTimerRunning,
  refetch
}) {
  const CTAs = {
    PRICE_DECISION: (
      <Mutation
        mutation={COMMIT}
        variables={{ label }}
        onCompleted={data => {
          setTxHash(Object.values(data)[0])
          incrementStep()
        }}
      >
        {mutate => (
          <Button data-testid="request-register-button" onClick={mutate}>
            Request to register
          </Button>
        )}
      </Mutation>
    ),
    COMMIT_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={() => {
          incrementStep()
          setTimerRunning(true)
        }}
      />
    ),
    COMMIT_CONFIRMED: (
      <Button data-testid="disabled-register-button" type="disabled">
        Register
      </Button>
    ),
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ label, duration }}
        onCompleted={data => {
          setTxHash(Object.values(data)[0])
          incrementStep()
        }}
      >
        {mutate => (
          <>
          <Prompt>Click register to move to the 3rd step</Prompt>
          <Button data-testid="register-button" onClick={mutate}>
            Register
          </Button>
          </>
        )}
      </Mutation>
    ),
    REVEAL_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={async () => {
          incrementStep()
        }}
      />
    ),
    REVEAL_CONFIRMED: (
      <Button data-testid="manage-name-button" onClick={() => refetch()}>
        <Pencil />
        Manage name
      </Button>
    )
  }
  return CTAs[step]
}

const CTA = ({
  step,
  incrementStep,
  decrementStep,
  duration,
  label,
  setTimerRunning,
  refetch
}) => {
  const [txHash, setTxHash] = useState(undefined)
  return (
    <CTAContainer>
      {getCTA({
        step,
        incrementStep,
        duration,
        label,
        txHash,
        setTxHash,
        setTimerRunning,
        refetch
      })}
    </CTAContainer>
  )
}

export default CTA