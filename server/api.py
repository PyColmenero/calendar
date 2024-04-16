from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pycolmenero:pycolmenero@localhost/postgres'
db = SQLAlchemy(app)
CORS(app)


class Calendar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(512))
    description = db.Column(db.String(4096))
    creation_date = db.Column(db.TIMESTAMP)

@app.route('/calendar', methods=['POST'])
def create_calendar_event():
    data = request.json
    new_event = Calendar(**data)
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'message': 'Calendar event created successfully'}), 201

@app.route('/calendars', methods=['GET'])
def fetch_calendar_events():
    events = Calendar.query.all()
    print(events)
    event_list = [{
        'id': event.id,
        'name': event.name,
        'description': event.description,
        'creation_date': event.creation_date
    } for event in events]
    return jsonify(event_list), 200

@app.route('/calendar/<int:event_id>', methods=['GET'])
def get_calendar_event(event_id):
    event = Calendar.query.get(event_id)
    if event is None:
        return jsonify({'message': 'Calendar event not found'}), 404
    return jsonify({
        'id': event.id,
        'name': event.name,
        'description': event.description,
        'creation_date': event.creation_date
    }), 200

@app.route('/calendar/<int:event_id>', methods=['PUT'])
def update_calendar_event(event_id):
    event = Calendar.query.get(event_id)
    if event is None:
        return jsonify({'message': 'Calendar event not found'}), 404

    data = request.json
    event.name = data.get('name', event.name)
    event.description = data.get('description', event.description)
    db.session.commit()
    return jsonify({'message': 'Calendar event updated successfully'}), 200

@app.route('/calendar/<int:event_id>', methods=['DELETE'])
def delete_calendar_event(event_id):
    event = Calendar.query.get(event_id)
    if event is None:
        return jsonify({'message': 'Calendar event not found'}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Calendar event deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
