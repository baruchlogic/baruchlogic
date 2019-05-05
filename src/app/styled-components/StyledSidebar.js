import styled from 'styled-components';

const StyledSidebar = styled.div`
  box-shadow: 1px 1px 2px 1px #2d0f4c;
  color: #2d0f4c;
  height: 1000px;
  min-width: 300px;
  text-align: center;
  width: 300px;
  a {
    color: #2d0f4c;
    display: flex;
    margin: 0.25rem 0;
    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }
  &&& h1 {
    color: #2d0f4c;
    padding-top: 1rem;
  }
  &&& li {
    list-style: none;
    text-align: left;
    &:hover {
      list-style: initial;
      color: #669eff;
    }
  }
  span {
    margin-right: 1rem;
  }
  ul {
    font-size: 1.2rem;
    padding: 0 2rem;
  }
`;

export default StyledSidebar;
