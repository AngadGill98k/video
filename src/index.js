import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './components/login/login'
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import {RouterProvider, createBrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import Search from './components/search/search';
import User from './components/User/user';
import Upload from './components/upload/upload';
import Song from './components/song/song';
import Playlist from './components/playlist/playlist';
const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>,
  },
  {
    path: '/home',
    element: <App/>,
  },
  {
    path: '/user',
    element: <User/>,
  },
  {
    path: '/upload',
    element: <Upload/>,
  },
  ,
  {
    path: '/search',
    element: <Search/>,
  },
  {
    path: '/song',
    element: <Song/>,
  },
  {
    path: '/playlist',
    element: <Playlist/>,
  }
])
root.render(
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
