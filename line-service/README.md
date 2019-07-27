# Samudra - LINE Service
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/ambv/black)
> LINE messenger gateway service for samudra, made with Flask & LINE bot SDK

## Installation
> 1. Make sure Python 3.6+ and Pip is installed
> 2. `pip3 install -r requirements.txt`
> 3. `python3 setup.py`
> 4. Rename `.env.example` to `.env` and customize to your configuration

## Running
> 1. `python3 app.py`
This will start a single-threaded synchronous WSGI server. Use it only
for development and local scale deployment

## Deployment
> 1. `pip3 install gunicorn gevent`
> 2. `gunicorn -w <worker_count> -k gevent -b 0.0.0.0:<PORT> app:app`
