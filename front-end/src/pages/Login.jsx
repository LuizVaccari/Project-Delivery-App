import React, { useEffect, useState } from 'react';
import './Login.css';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import md5 from 'md5';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disAbleBtn, setDisAbleBtn] = useState(true);
  const [hideWarning, setHideWarning] = useState(true);

  const history = useHistory();

  function checkPassword(user, token) {
    if (user.password === md5(password)) {
      const localStrg = {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
        token,
      };
      localStorage.setItem('user', JSON.stringify(localStrg));
      if (user.role === 'customer') {
        history.push('/customer/products');
      }
      if (user.role === 'seller') {
        history.push('/seller/orders');
      }
      if (user.role === 'administrator') {
        history.push('/admin/manage');
      }
    }
  }

  async function loginClic() {
    const data = { email };
    const myBody = JSON.stringify(data);
    const request = await fetch('http://localhost:3001/user/login', {
      method: 'POST',
      body: myBody,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { message, user, token } = await request.json();
    if (message) {
      setHideWarning(false);
    } else {
      checkPassword(user, token);
    }
  }

  function handleRegisterClick() {
    history.push('/register');
  }

  useEffect(() => {
    function checkBtn() {
      const passwordLength = 6;
      const re = /\S+@\S+\.\S+/;
      if (password.length >= passwordLength && re.test(email)) {
        setDisAbleBtn(false);
        return;
      }
      setDisAbleBtn(true);
    }
    setHideWarning(true);
    checkBtn();
  }, [email, password]);

  useEffect(() => {
    const isLoged = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      if (user.role === 'customer') {
        history.push('/customer/products');
      } else if (user.role === 'seller') {
        history.push('/seller/orders');
      }
    };
    isLoged();
  }, [history]);

  return (
    <>
      <Form className="login-form">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            data-testid="common_login__input-email"
            size="sm"
            type="email"
            placeholder="Enter email"
            value={ email }
            onChange={ (e) => setEmail(e.target.value) }
          />
          <Form.Text className="text-muted">
            We will never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            data-testid="common_login__input-password"
            type="password"
            placeholder="Password"
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
          />
        </Form.Group>
        <Button
          onClick={ loginClic }
          variant="primary"
          type="button"
          data-testid="common_login__button-login"
          disabled={ disAbleBtn }
        >
          LOGIN
        </Button>
        <br />
        <br />
        <Button
          onClick={ handleRegisterClick }
          variant="secondary"
          type="button"
          data-testid="common_login__button-register"
        >
          AINDA N??O TENHO CONTA
        </Button>
      </Form>
      <p
        data-testid="common_login__element-invalid-email"
        hidden={ hideWarning }
      >
        Email n??o cadastrado!
      </p>
    </>
  );
}

export default Login;
