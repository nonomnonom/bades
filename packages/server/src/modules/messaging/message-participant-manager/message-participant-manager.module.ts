import { Module } from '@nestjs/common';

// Bades: modul stub. Logika participant matching + person/company contact
// creation dihapus karena tidak relevan untuk operasi administrasi desa.
// Modul tetap di-expose agar wiring DI lama (messaging-import-manager dll)
// tidak pecah. Sinkronisasi pesan tetap berfungsi, tetapi tidak lagi
// memetakan participant ke record orang.
@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class MessageParticipantManagerModule {}
