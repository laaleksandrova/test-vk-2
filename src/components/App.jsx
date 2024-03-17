import React from 'react';
import '../App.css';
import Container from 'react-bootstrap/Container';
import TextFieldAndButton from './TextFieldAndButton.jsx';
import FormTextAndButton from './FormTextAndButton.jsx';

function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <Container className="h-100 my-4">
        <TextFieldAndButton />
        <FormTextAndButton />
      </Container>
    </div>
  );
}

export default App;
