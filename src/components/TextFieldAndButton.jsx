import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const TextFieldAndButton = () => {
  const [ text, setText ] = useState('');
  const [ position, setPosition ] = useState(0);
  const textareaRef = useRef(null);

  const handleCurrentText = async () => {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      const json = await response.json();
      setText(json.fact);
    } catch (err) {
        console.log( "JSON Error: " + err.message ); 
    }
  }

  useEffect(() => {
    textareaRef.current.selectionStart = position;
    textareaRef.current.selectionEnd = position;
    let positionCount = text.split(' ').slice(0, 1).toString().length;
    setPosition(positionCount)
    textareaRef.current.focus();
  });

  return (
    <Container className="h-50 rounded shadow overflow-hidden mb-2">
      <Button
        type="button"
        className="w-100 mb-3" variant="outline-primary"
        onClick={() => handleCurrentText()}
      >
        Получить текст
      </Button>
      <Form>
          <Form.Control as="textarea" rows={3} value={text} ref={textareaRef} onChange={(event) =>(event)} />
      </Form>
    </Container>
  );
}

export default TextFieldAndButton;
