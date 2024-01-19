from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/receive_html', methods=['POST'])
def receive_html():
    html_data = request.data.decode('utf-8')
    print(html_data)
    return 'HTML Received'

if __name__ == '__main__':
    app.run(port=5000)
