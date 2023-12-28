import gc


def ClearMemory():
    count = gc.collect()
    print(f"removed {count} objects")
