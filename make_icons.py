import base64, struct, zlib, shutil

# Simple blue SMS icon PNG (192x192 sy 512x512)
# Ampiasaina Python mivantana fa tsy mila library ivelany

def make_simple_png(size, filename):
    # Mamorona PNG tsotra - background navy + "SMS" text equivalent
    # Ampiasaina ilay color scheme #0A1628 + #1B6CF2
    w = h = size
    # Raw pixel data: RGBA
    pixels = []
    cx, cy = w//2, h//2
    r_outer = int(w * 0.45)
    r_inner = int(w * 0.35)
    for y in range(h):
        row = []
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = (dx*dx + dy*dy) ** 0.5
            if dist < r_outer:
                if dist < r_inner:
                    # inner circle: blue #1B6CF2
                    row += [0x1B, 0x6C, 0xF2, 0xFF]
                else:
                    # ring: lighter blue #2979FF
                    row += [0x29, 0x79, 0xFF, 0xFF]
            else:
                # background: #0A1628
                row += [0x0A, 0x16, 0x28, 0xFF]
        pixels.append(bytes(row))
    
    def make_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    # RGBA = color type 6
    ihdr = struct.pack('>II', w, h) + bytes([8, 6, 0, 0, 0])
    
    raw = b''
    for row in pixels:
        raw += b'\x00' + row  # filter type none
    
    compressed = zlib.compress(raw, 9)
    
    png = b'\x89PNG\r\n\x1a\n'
    png += make_chunk(b'IHDR', ihdr)
    png += make_chunk(b'IDAT', compressed)
    png += make_chunk(b'IEND', b'')
    
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Created {filename} ({size}x{size})")

make_simple_png(192, 'icon-192.png')
make_simple_png(512, 'icon-512.png')
