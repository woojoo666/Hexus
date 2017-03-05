from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit
import os
from flask import send_from_directory

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def hello_world():
    return app.send_static_file('index.html')

@app.route('/public/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())
    print(os.path.join(root_dir, 'public'))
    return send_from_directory(os.path.join(root_dir,'hexus', 'public'), filename)

@app.route('/play_dota')
def play_dota():
	os.system('"C:\\Users\\svich_000\\Desktop\\open_dota.bat"')
	return "Done!"

@app.route('/quit_dota')
def quit_dota():
    os.system("taskkill /IM dota2.exe")
    return "Quit!"

@socketio.on('my event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app)