import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useRef, useEffect, useState } from 'react';

const FormTextAndButton = () => {
  const [textAge , setTextAge] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const inputRef = useRef();
  const abortController = useRef(new AbortController());

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim()
      .min(3, 'Минимум 3 буквы')
      .max(20, 'Максимум 20 букв')
      .required('Обязательное поле')
      .matches(/[a-zA-zа]$/, 'Допускаются только латинские буквы')
      .test('unique',
        'Уникальное Имя',
        (value) => {if(value !== prevValue) return true}
      )
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async ({ name }) => {
      setPrevValue(name);
      // Отменяем предыдущий запрос, если он был
      abortController.current.abort();
      // Создаем новый экземпляр AbortController для следующего запроса
      abortController.current = new AbortController();
      const { signal } = abortController.current;
      try {
        const response = await fetch(`https://api.agify.io?name=${name}`, { signal });
         const json = await response.json();
        setTextAge(json.age)
      } catch(err) {
        formik.setSubmitting(false);
        if (err.name === 'AbortError') {
        // Обработка ошибки отмены запроса
        console.log('Запрос был прерван');
        } else {
        // Обработка других ошибок
        console.log("JSON Error: " + err.message);
        }
      }
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Container fluid className="h-50 rounded shadow overflow-hidden mb-2">
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="py-3">
              <Form onSubmit={formik.handleSubmit}>
                <Form.Floating >
                  <Form.FloatingLabel label="Введите свое имя"className="mb-3" >
                    <Form.Control
                      aria-label="Имя пользователя"
                      placeholder="Введите свое имя"
                      onChange={formik.handleChange}
                      // onBlur={formik.handleBlur}
                      value={formik.values.name}
                      isInvalid={!!formik.errors.name}
                      name="name"
                      id="name"
                      autoComplete="false"
                      ref={inputRef}
                      type="text"
                      className="mb-2"
                    />
                   <Form.Control.Feedback type="invalid" className="mb-2">
                      {formik.errors.name}
                    </Form.Control.Feedback>
                  </Form.FloatingLabel>
                  <Button type="submit"className="w-100 mb-3" variant="outline-primary" disabled={!!formik.errors.name}>
                    Отправить
                  </Button>
                </Form.Floating>
              </Form>
            </div>
            <div className="bg-light px-1 py-3 shadow-sm small">
              <p className="m-0">
                <b>Возраст: {textAge}</b>
              </p>
            </div>
          </div>
        </Col>
    </Container>
  );
}

export default FormTextAndButton;
