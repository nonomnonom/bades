import { msg } from '@lingui/core/macro';
import { HeadingPart, LinkButton } from '@/design-system/components';
import { fetchCommunityStats } from '@/lib/community/fetch-community-stats';
import {
  getRouteI18n,
  type LocaleRouteParams,
} from '@/lib/i18n/utils/get-route-i18n';
import { Pages } from '@/lib/pages';
import { mergeSocialLinkLabels } from '@/lib/community/merge-social-link-labels';
import { Editorial } from '@/sections/Editorial';
import { Hero } from '@/sections/Hero';
import { Marquee } from '@/sections/Marquee';
import { Menu, MENU_DATA } from '@/sections/Menu';
import { Signoff } from '@/sections/Signoff';
import { theme } from '@/theme';
import { buildRouteMetadata } from '@/lib/seo';
import { css } from '@linaria/core';

const editorialOneIntroClass = css`
  margin-bottom: ${theme.spacing(4)};
  --editorial-heading-max-width: 760px;
  --editorial-intro-max-width: 760px;

  @media (min-width: ${theme.breakpoints.md}px) {
    margin-bottom: ${theme.spacing(8)};
  }
`;

const editorialRightIntroClass = css`
  margin-bottom: ${theme.spacing(4)};
  --editorial-heading-max-width: 760px;
  --editorial-intro-max-width: 760px;

  @media (min-width: ${theme.breakpoints.md}px) {
    align-items: flex-end;
    margin-bottom: ${theme.spacing(8)};
    margin-left: auto;
    margin-right: 0;
    text-align: right;
    width: auto;
  }
`;

const crosshairLineColor = theme.colors.secondary.border[10];

const sectionCrosshairLeft = {
  crossX: '120px',
  crossY: '0px',
  lineColor: crosshairLineColor,
};

const sectionCrosshairRight = {
  crossX: 'calc(100% - 120px)',
  crossY: '0px',
  lineColor: crosshairLineColor,
};

export const generateMetadata = buildRouteMetadata('whyBades');

type WhyBadesPageProps = {
  params: Promise<LocaleRouteParams>;
};

export default async function WhyBadesPage({ params }: WhyBadesPageProps) {
  const [i18n, stats] = await Promise.all([
    getRouteI18n(params),
    fetchCommunityStats(),
  ]);
  const menuSocialLinks = mergeSocialLinkLabels(MENU_DATA.socialLinks, stats);

  return (
    <>
      {/*
       * Above-the-fold hero scene. Preload kicks off the GLB fetch in
       * parallel with the JS chunk download, so the model is already in
       * the browser cache by the time Three.js asks for it.
       */}
      <link
        as="fetch"
        href="/illustrations/why-bades/hero/hero.glb"
        rel="preload"
      />
      <Menu.Root
        backgroundColor={theme.colors.secondary.background[100]}
        scheme="secondary"
        navItems={MENU_DATA.navItems}
        socialLinks={menuSocialLinks}
      >
        <Menu.Logo scheme="secondary" />
        <Menu.Nav scheme="secondary" navItems={MENU_DATA.navItems} />
        <Menu.Social scheme="secondary" socialLinks={menuSocialLinks} />
        <Menu.Cta scheme="secondary" />
      </Menu.Root>

      <Hero.Root scheme="dark">
        <Hero.Heading page={Pages.WhyBades} size="xl">
          <HeadingPart fontFamily="serif">
            {i18n._(msg`The future of village administration is built,`)}
          </HeadingPart>{' '}
          <HeadingPart fontFamily="sans">
            {i18n._(msg`not bought.`)}
          </HeadingPart>
        </Hero.Heading>
        <Hero.Body page={Pages.WhyBades}>
          {i18n._(
            msg`Sistem administrasi desa dulu hanya database yang diisi setiap Jumat. AI mengubahnya menjadi sistem yang menjalankan tata kelola desa secara aktif. Untuk unggul, Anda harus membangun apa yang tidak bisa dibeli pesaing.`,
          )}
        </Hero.Body>
        <Hero.WhyBadesVisual />
      </Hero.Root>

      <Editorial.Root scheme="dark" crosshair={sectionCrosshairRight}>
        <Editorial.Intro className={editorialOneIntroClass}>
          <Editorial.Eyebrow colorScheme="secondary">
            {i18n._(msg`The shift`)}
          </Editorial.Eyebrow>
          <Editorial.Heading>
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Village administration was a ledger.`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`AI turned it into an operating system.`)}
            </HeadingPart>
          </Editorial.Heading>
        </Editorial.Intro>
        <Editorial.Body layout="two-column-left">
          {i18n._(
            msg`Selama dua puluh tahun, administrasi desa berarti hal yang sama: tempat mencatat kegiatan, melacak izin, dan menarik laporan setiap Jumat. Pekerjaan nyata terjadi di kepala orang, di grup WhatsApp, di obrolan lorong balai desa. Sistem hanya menjadi papan skor. Tidak ada yang mengharapkan lebih darinya.`,
          )}
          {i18n._(
            msg`Agen AI kini mulai menyusun pengumuman, menilai permohonan, meneliti data warga, menulis tindak lanjut, memperbarui tahapan layanan. Setiap tindakan ini membaca dari dan menulis ke sistem. Papan skor menjadi buku panduan. Database menjadi otak operasional.`,
          )}
        </Editorial.Body>
      </Editorial.Root>

      <Editorial.Root scheme="dark" crosshair={sectionCrosshairLeft}>
        <Editorial.Intro className={editorialRightIntroClass}>
          <Editorial.Eyebrow colorScheme="secondary">
            {i18n._(msg`What this means`)}
          </Editorial.Eyebrow>
          <Editorial.Heading>
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Differentiation now`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`lives in the code you own.`)}
            </HeadingPart>
          </Editorial.Heading>
        </Editorial.Intro>
        <Editorial.Body layout="two-column-right">
          {i18n._(
            msg`Anda tidak membeli alur layanan dari toko. Anda tidak menyewa gudang data dari vendor yang menentukan skemanya. Anda membangunnya, memilikinya, mengiterasinya setiap minggu. Administrasi desa sedang menuju ke arah yang sama. Desa-desa yang memperlakukannya sebagai infrastruktur yang mereka miliki akan mengakumulasi keunggulan setiap triwulan.`,
          )}
          {i18n._(
            msg`Rabu tim Anda menemukan bahwa permohonan dengan pendampingan teknis selesai 3x lebih cepat. Kamis Anda tambahkan field, hubungkan penilaian, sesuaikan alur kerja. Jumat agen Anda sudah bertindak berdasarkan itu. Putaran umpan balik itulah keunggulannya. Dan itu hanya berjalan jika sistemnya milik Anda.`,
          )}
        </Editorial.Body>
      </Editorial.Root>

      <Editorial.Root scheme="dark" crosshair={sectionCrosshairRight}>
        <Editorial.Intro className={editorialOneIntroClass}>
          <Editorial.Eyebrow colorScheme="secondary">
            {i18n._(msg`The opportunity`)}
          </Editorial.Eyebrow>
          <Editorial.Heading>
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Build it in an afternoon.`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`AI made the gap that small.`)}
            </HeadingPart>
          </Editorial.Heading>
        </Editorial.Intro>
        <Editorial.Body layout="two-column-left">
          {i18n._(
            msg`Setahun lalu, menyesuaikan sistem desa berarti menyewa konsultan, mempelajari skema, menunggu berbulan-bulan. Jarak antara "saya ingin ini" dan "sudah berjalan" diukur dalam triwulan dan tagihan. Jadi orang-orang menyerah. Mereka membengkokkan prosesnya agar cocok dengan alat yang ada, dan menyebutnya adopsi.`,
          )}
          {i18n._(
            msg`Kini satu petugas bisa menggambarkan apa yang diinginkan dan mendapatkan sistem yang berfungsi dalam satu sore. Objek khusus, alur penilaian, tampilan baru, integrasi. Hambatannya bukan lagi soal membangun. Hambatannya adalah apakah platform Anda mengizinkannya.`,
          )}
        </Editorial.Body>
      </Editorial.Root>

      <Marquee.Root
        scheme="dark"
        segments={[
          { fontFamily: 'serif', text: i18n._(msg`Sistem yang sama`) },
          { fontFamily: 'sans', text: i18n._(msg`Hasil yang sama`) },
          { fontFamily: 'serif', text: i18n._(msg`Dampak yang sama`) },
        ]}
      />

      <Signoff.Root scheme="dark" page={Pages.WhyBades}>
        <Signoff.Heading page={Pages.WhyBades}>
          <HeadingPart fontFamily="serif">
            {i18n._(msg`Build a village system your competitors`)}
          </HeadingPart>{' '}
          <HeadingPart fontFamily="sans">{i18n._(msg`can't buy.`)}</HeadingPart>
        </Signoff.Heading>
        <Signoff.Body page={Pages.WhyBades}>
          {i18n._(msg`Layanan terkelola, siap AI, dan sepenuhnya untuk Anda kembangkan.`)}
        </Signoff.Body>
        <Signoff.Cta>
          <LinkButton
            color="primary"
            href="https://bades.id/masuk"
            label={i18n._(msg`Mulai sekarang`)}
            variant="contained"
          />
        </Signoff.Cta>
      </Signoff.Root>
    </>
  );
}
