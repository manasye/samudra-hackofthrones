from flask import Flask, request, jsonify

from client import InstagramClient


app = Flask(__name__)
client = InstagramClient()


@app.route("/upload", methods=["POST"])
def upload():
    upload_status = client.upload(request.json["image"], request.json["caption"])
    if upload_status:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004)
