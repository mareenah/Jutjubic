import pika
import json
import upload_event_pb2
import time
from statistics import mean

RABBIT_HOST = 'localhost'
JSON_QUEUE = 'upload_events_json'
PROTO_QUEUE = 'upload_events_proto'

def consume_json():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBIT_HOST))
    channel = connection.channel()
    channel.queue_declare(queue=JSON_QUEUE)

    sizes = []
    deserialization_times = []
    serialization_times = []

    def callback(ch, method, properties, body):
        # Deserialization timing
        start_deser = time.perf_counter()
        data = json.loads(body)
        end_deser = time.perf_counter()
        deserialization_times.append((end_deser - start_deser) * 1000)  # ms

        # Measure serialization time (re-serialize the received object)
        start_ser = time.perf_counter()
        _ = json.dumps(data).encode()
        end_ser = time.perf_counter()
        serialization_times.append((end_ser - start_ser) * 1000)

        sizes.append(len(body))
        print(f"JSON received: {data}")

        if len(sizes) >= 50:
            print("----JSON Stats----")
            print(f"Average message size: {mean(sizes):.2f} mb")
            print(f"Average serialization time: {mean(serialization_times):.3f} ms")
            print(f"Average deserialization time: {mean(deserialization_times):.3f} ms")
            connection.close()

    channel.basic_consume(queue=JSON_QUEUE, on_message_callback=callback, auto_ack=True)
    print("Waiting for JSON messages...")
    channel.start_consuming()


def consume_protobuf():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBIT_HOST))
    channel = connection.channel()
    channel.queue_declare(queue=PROTO_QUEUE)

    sizes = []
    deserialization_times = []
    serialization_times = []

    def callback(ch, method, properties, body):
        # Deserialization timing
        start_deser = time.perf_counter()
        proto_msg = upload_event_pb2.UploadEvent()
        proto_msg.ParseFromString(body)
        end_deser = time.perf_counter()
        print(f"Protobuf received: videoId={proto_msg.videoId}, title={proto_msg.title}, author={proto_msg.author}, sizeMB={proto_msg.sizeMB}")
        deserialization_times.append((end_deser - start_deser) * 1000)

        # Serialization timing (re-serialize the received object)
        start_ser = time.perf_counter()
        _ = proto_msg.SerializeToString()
        end_ser = time.perf_counter()
        serialization_times.append((end_ser - start_ser) * 1000)

        sizes.append(len(body))
        print(f"Protobuf received: videoId={proto_msg.videoId}, title={proto_msg.title}")

        if len(sizes) >= 50:
            print("----Protobuf Stats----")
            print(f"Average message size: {mean(sizes):.2f} mb")
            print(f"Average serialization time: {mean(serialization_times):.3f} ms")
            print(f"Average deserialization time: {mean(deserialization_times):.3f} ms")
            connection.close()

    channel.basic_consume(queue=PROTO_QUEUE, on_message_callback=callback, auto_ack=True)
    print("Waiting for Protobuf messages...")
    channel.start_consuming()


if __name__ == "__main__":
    print("Choose which queue to consume:")
    print("1 - JSON")
    print("2 - Protobuf")
    choice = input("Enter 1 or 2: ").strip()

    if choice == "1":
        consume_json()
    elif choice == "2":
        consume_protobuf()
    else:
        print("Invalid choice. Exiting.")