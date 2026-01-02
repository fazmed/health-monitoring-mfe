import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import { Container, Navbar, Nav, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuthApp = lazy(() => import('auth-app/App'));
const PatientApp = lazy(() => import('patient-app/App'));

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
  credentials: 'include'
});

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      username
      email
      role
      firstName
      lastName
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

function ShellApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { data, loading, refetch } = useQuery(GET_CURRENT_USER, {
    client,
    onCompleted: (data) => {
      if (data?.getCurrentUser) {
        setIsAuthenticated(true);
        setCurrentUser(data.getCurrentUser);
      }
    },
    onError: () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  });

  const [logout] = useMutation(LOGOUT, {
    client,
    onCompleted: () => {
      client.clearStore();
      setIsAuthenticated(false);
      setCurrentUser(null);
      window.location.reload();
    }
  });

  useEffect(() => {
    const handleLoginSuccess = (event) => {
      setIsAuthenticated(true);
      setCurrentUser(event.detail.user);
      refetch();
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    return () => window.removeEventListener('loginSuccess', handleLoginSuccess);
  }, [refetch]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">PatientCare App</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {isAuthenticated && currentUser && (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {currentUser.firstName} ({currentUser.role})
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Suspense fallback={
        <Container className="mt-5 text-center">
          <Spinner animation="border" />
        </Container>
      }>
        {!isAuthenticated ? (
          <AuthApp />
        ) : (
          <PatientApp />
        )}
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <ShellApp />
    </ApolloProvider>
  );
}

export default App;
