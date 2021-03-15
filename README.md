Versi patch Z (x.y.Z	x > 0) HARUS dinaikkan jika ada perbaikan bug tanpa menambah fitur.

Versi minor Y (x.Y.z | x > 0) HARUS dinaikkan jika ada fitur baru, atau ada fitur lama yang yang sudah usang. Versi ini BISA dinaikkan jika ada tambahan fungsionalitas substansial atau terjadi peningkatan. Versi ini BISA diubah bersama dengan versi patch. Versi patch HARUS dikembalikan ke angka 0 jika versi minor dinaikkan.

Versi major X (X.y.z | X > 0) HARUS dinaikkan jika ada perubahan yang membuat versi baru tidak kompatibel dengan versi lama, seperti menghapus fitur lama, menambah fitur baru yang tidak bisa digunakan di versi lama, BISA diubah bersama dengan versi patch dan minor, jika versi major dinaikkan, maka versi minor dan patch harus dikembalikan ke angka 0.

Versi sebelum rilis BISA ditulis dengan menambahkan garis dan bisa dipisah dengan titik tepat setelah versi patch. Versi sebelum rilis HARUS ditulis dengan huruf ASCII alfanumerik dan garis [0-9A-Za-z], TIDAK BOLEH kosong, dan angka TIDAK BOLEH didahului dengan angka 0. Versi sebelum rilis dianggap tidak stabil dan dikesampingkan jika ada versi yang stabil. Contoh: 1.0.0-alpha, 2.3.1-beta.
