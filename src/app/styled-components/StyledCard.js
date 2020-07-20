import styled from 'styled-components';
import { Card } from '@blueprintjs/core';

const StyledCard = styled(Card)`
  font-size: 1.5rem;
  margin: 1rem auto;
  text-align: center;
  max-width: 100%;
  overflow: ${props => (props.scroll ? 'auto' : 'visible')};
`;

export default StyledCard;
