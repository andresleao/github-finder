import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  GET_USERS,
  SEARCH_USERS,
  GET_USER,
  CLEAR_USERS,
  GET_REPOS,
  SET_LOADING,
} from '../types';

const githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
const githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;

const GithubState = (props) => {
  const inicialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, inicialState);

  // Get users
  const getUsers = async () => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users?client_id=${githubClientId}&client_secret=${githubClientSecret}`
    );
    dispatch({ type: GET_USERS, payload: res.data });
  };

  // Search Github users
  const searchUsers = async (text) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`
    );
    dispatch({ type: SEARCH_USERS, payload: res.data.items });
  };

  // Get single user
  const getUser = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
    );
    dispatch({ type: GET_USER, payload: res.data });
  };

  // Get user repos
  const getUserRepos = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
    );
    dispatch({ type: GET_REPOS, payload: res.data });
  };

  // Clear users from state
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        getUsers,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
