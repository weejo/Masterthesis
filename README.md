# Welcome to Planetracer!

Planetracer is the project for the development part of the master thesis of Jonas Wendel @ FH Technikum Wien.

The backend provides an API for adding levels, getting data and aggregations of produced data.
The python part shows examples of usage of UMAP for dimensionality reduction and evaluation of the player produced data.

# Frontend

The frontend was done with Phaser3 and Parcel,  quickly started via "parcel index.html".
It allows players to play an Asteroids-like game to try and tag all planets on the map as quickly as possible without crashing into one of them. The game provides a atari-styled theme and a player highscore.
The data produced by the player during play is sent to the backend after at least tagging 97% of the planets.

# Backend
The backend based on Spring Boot and Docker, provides a liquibase and should be easy to just plug and play (with docker available), also starting a postgres container to save generated data.
The backend API enables access for researchers to add levels (= data to be clustered), retrieve the produced data as well as aggregated incidence matrices of the data per level.

# Python

The Python project shows examples for using UMAP for dimensionality reduction, as the game only supports 2D data, as well as the evaluation tools used to compare the games / players performance to that of DBSCAN (a clustering algorithm intuitively based on the concept of density in clusters and lack thereof in noise).

