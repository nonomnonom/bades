---
name: Permintaan pekerjaan teknis
about: Permintaan pekerjaan teknis yang tidak menambah fitur produk (refactoring, cleanup, dsb)
title: ''
labels: ['type: chore']
assignees: ''
---

## Lingkup & Konteks

**Contoh:**
```
Pada PR sebelumnya (#1667 dan #1636), kami memperkenalkan MenuItem yang bisa di-drag
di dalam dropdown dan mengimplementasikan perilaku drag and drop.

Ini sudah berjalan tetapi akan lebih baik jika di-refactor menjadi komponen terpisah
agar bisa digunakan kembali di tempat lain.
```

## Masukan teknis

Deskripsi jelas dan detail tentang perubahan yang diharapkan.
Jelaskan komponen, file, dan folder yang perlu disentuh beserta caranya.
Menggunakan daftar tugas (task list) akan sangat membantu.

**Contoh:**
```
Daftar yang bisa di-drag akan berguna tidak hanya di dropdown.

Buat folder @/ui/draggable-list dengan komponen DraggableList.
Komponen ini menerima prop: itemsComponents, onDragEnd((previousIndex, nextIndex) => {}).
Gunakan komponen ini di ObjectOptionsDropdownHiddenFieldsContent dengan meneruskan
daftar DraggableMenuItems.
Tambahkan storybook test untuk daftar ini.
```

