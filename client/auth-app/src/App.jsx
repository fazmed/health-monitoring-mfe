import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useMutation } from '@apollo/client';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
  credentials: 'include'
});

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!, $firstName: String!, $lastName: String!) {
    register(username: $username, email: $email, password: $password, role: $role, firstName: $firstName, lastName: $lastName) {
      token
      user {
        id
        username
        email
        role
        firstName
        lastName
      }
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
        firstName
        lastName
      }
    }
  }
`;

function AuthComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [register] = useMutation(REGISTER, {
    onCompleted: (data) => {
      setSuccess('Registration successful! Redirecting...');
      setError('');
      window.dispatchEvent(new CustomEvent('loginSuccess', {
        detail: { user: data.register.user, token: data.register.token }
      }));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      setError(error.message);
      setSuccess('');
    }
  });

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setSuccess('Login successful! Redirecting...');
      setError('');
      window.dispatchEvent(new CustomEvent('loginSuccess', {
        detail: { user: data.login.user, token: data.login.token }
      }));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      setError(error.message);
      setSuccess('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      login({ variables: { email: formData.email, password: formData.password } });
    } else {
      register({ variables: formData });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">{isLogin ? 'Login' : 'Register'} - PatientCare App</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Select name="role" value={formData.role} onChange={handleChange}>
                        <option value="patient">Patient</option>
                        <option value="nurse">Nurse</option>
                      </Form.Select>
                    </Form.Group>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  {isLogin ? 'Login' : 'Register'}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthComponent />
    </ApolloProvider>
  );
}

export default App;
