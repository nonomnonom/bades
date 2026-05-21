import { APP_PREVIEW_DATA } from '@/app/[locale]/(home)/app-preview.data';
import { AI_HERO_TABS } from '@/app/[locale]/product/ai-hero-tabs.data';
import { FEATURE_TILES } from '@/app/[locale]/product/feature.data';
import { ILLUSTRATION_CARDS } from '@/app/[locale]/product/three-cards.data';
import {
  Eyebrow,
  Heading,
  HeadingPart,
  LinkButton,
} from '@/design-system/components';
import { fetchCommunityStats } from '@/lib/community/fetch-community-stats';
import { mergeSocialLinkLabels } from '@/lib/community/merge-social-link-labels';
import {
  getRouteI18n,
  type LocaleRouteParams,
} from '@/lib/i18n/utils/get-route-i18n';
import { Pages } from '@/lib/pages';
import {
  buildBreadcrumbListJsonLd,
  buildRouteMetadata,
  JsonLd,
} from '@/lib/seo';
import { TalkToUsButton } from '@/sections/ContactCal';
import { Demo } from '@/sections/Demo';
import { Faq, FAQ_QUESTIONS } from '@/sections/Faq';
import { Feature } from '@/sections/Feature';
import { Hero } from '@/sections/Hero';
import { Menu, MENU_DATA } from '@/sections/Menu';
import {
  ProductStepper,
  type ProductStepperStepType,
} from '@/sections/ProductStepper';
import { DataModelVisual } from '@/sections/ProductStepper/visuals/DataModelVisual';
import { LayoutVisual } from '@/sections/ProductStepper/visuals/LayoutVisual';
import { WorkflowVisual } from '@/sections/ProductStepper/visuals/WorkflowVisual';
import { ThreeCards } from '@/sections/ThreeCards';
import { TRUSTED_BY_LOGOS, TrustedBy } from '@/sections/TrustedBy';
import { theme } from '@/theme';
import { msg } from '@lingui/core/macro';
import type { AppLocale } from 'shared/translations';

export const generateMetadata = buildRouteMetadata('product');

type ProductPageProps = {
  params: Promise<LocaleRouteParams>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const [i18n, stats] = await Promise.all([
    getRouteI18n(params),
    fetchCommunityStats(),
  ]);
  const menuSocialLinks = mergeSocialLinkLabels(MENU_DATA.socialLinks, stats);

  const PRODUCT_STEPS: ProductStepperStepType[] = [
    {
      icon: 'users',
      heading: (
        <HeadingPart fontFamily="sans">{i18n._(msg`Model data`)}</HeadingPart>
      ),
      body: msg`Tambahkan objek dan field sesuai kebutuhan desa`,
      visual: DataModelVisual,
    },
    {
      icon: 'check',
      heading: (
        <HeadingPart fontFamily="sans">{i18n._(msg`Otomasi`)}</HeadingPart>
      ),
      body: msg`Buat alur kerja otomatis`,
      visual: WorkflowVisual,
    },
    {
      icon: 'eye',
      heading: (
        <HeadingPart fontFamily="sans">{i18n._(msg`Tata letak`)}</HeadingPart>
      ),
      body: msg`Sesuaikan halaman rekaman, menu, dan tampilan`,
      visual: LayoutVisual,
    },
  ];

  return (
    <>
      <JsonLd
        data={buildBreadcrumbListJsonLd(
          [
            { name: 'Home', path: '/' },
            { name: 'Product', path: '/product' },
          ],
          i18n.locale as AppLocale,
        )}
      />
      <Menu.Root
        backgroundColor={theme.colors.primary.background[100]}
        scheme="primary"
        navItems={MENU_DATA.navItems}
        socialLinks={menuSocialLinks}
      >
        <Menu.Logo scheme="primary" />
        <Menu.Nav scheme="primary" navItems={MENU_DATA.navItems} />
        <Menu.Social scheme="primary" socialLinks={menuSocialLinks} />
        <Menu.Cta scheme="primary" />
      </Menu.Root>

      <Hero.HeroVisualScroll
        aiBody={i18n._(
          msg`Ajukan pertanyaan, otomasi tugas, dan dapatkan wawasan. Semua didukung AI yang memahami data desa Anda.`,
        )}
        aiHeading={
          <Heading size="lg" weight="light">
            <HeadingPart fontFamily="serif">
              {i18n._(msg`AI yang benar-benar`)}
            </HeadingPart>
            <br />
            <HeadingPart fontFamily="serif">
              {i18n._(msg`membantu Anda`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`bekerja lebih cepat`)}
            </HeadingPart>
          </Heading>
        }
        ctaHref="https://bades.id/masuk"
        ctaLabel={i18n._(msg`Mulai sekarang`)}
        introBody={i18n._(
          msg`Kelola data warga, tangani alur permohonan layanan desa, dan ambil tindakan cepat dengan Sistem Informasi Desa yang terasa intuitif sejak hari pertama.`,
        )}
        introHeading={
          <Heading size="lg" weight="light">
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Sistem Informasi Desa`)}
            </HeadingPart>
            <br />
            <HeadingPart fontFamily="serif">
              {i18n._(msg`yang`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`bergerak cepat`)}
            </HeadingPart>
          </Heading>
        }
        tabs={AI_HERO_TABS}
        visual={APP_PREVIEW_DATA.visual}
      />

      <TrustedBy.Root
        separator={i18n._(msg`dipercaya oleh`)}
        logos={TRUSTED_BY_LOGOS}
        clientCount={i18n._(msg`+10rb desa lainnya`)}
      />

      <Feature.Root scheme="light">
        <Feature.Intro align="center" page={Pages.Product}>
          <Eyebrow>
            <HeadingPart fontFamily="sans">
              {i18n._(msg`Fitur Utama`)}
            </HeadingPart>
          </Eyebrow>
          <Heading size="lg" weight="light">
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Semua yang Anda butuhkan,`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`langsung siap pakai`)}
            </HeadingPart>
          </Heading>
        </Feature.Intro>
        <Feature.Tiles tiles={FEATURE_TILES} />
      </Feature.Root>

      <ThreeCards.Root scheme="light">
        <ThreeCards.Intro page={Pages.Product} align="left">
          <Eyebrow>
            <HeadingPart fontFamily="sans">
              {i18n._(msg`Hentikan kompromi yang tidak perlu.`)}
            </HeadingPart>
          </Eyebrow>
          <Heading size="lg" weight="light">
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Sistem Informasi Desa yang modern dengan`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`antarmuka yang intuitif`)}
            </HeadingPart>
          </Heading>
        </ThreeCards.Intro>
        <ThreeCards.IllustrationCards illustrationCards={ILLUSTRATION_CARDS} />
      </ThreeCards.Root>

      <ProductStepper.Flow
        body={i18n._(
          msg`Perlu perubahan cepat? Tidak perlu menunggu tim teknis. Kustomisasi sistem desa Anda dalam hitungan menit.`,
        )}
        eyebrow={i18n._(msg`Kustomisasi`)}
        steps={PRODUCT_STEPS}
      >
        <HeadingPart fontFamily="serif">
          {i18n._(msg`Lakukan lebih banyak`)}
        </HeadingPart>{' '}
        <HeadingPart fontFamily="sans">{i18n._(msg`tanpa koding`)}</HeadingPart>
      </ProductStepper.Flow>

      <Demo.Root>
        <Eyebrow>
          <HeadingPart fontFamily="sans">
            {i18n._(msg`Coba langsung`)}
          </HeadingPart>
        </Eyebrow>
        <Heading size="lg" weight="light">
          <HeadingPart fontFamily="serif">
            {i18n._(msg`Demo yang bernilai`)}
          </HeadingPart>
          <br />
          <HeadingPart fontFamily="sans">
            {i18n._(msg`seribu kata`)}
          </HeadingPart>
        </Heading>
        <Demo.Cta>
          <LinkButton
            color="secondary"
            href="https://bades.id/masuk"
            label={i18n._(msg`Coba Bades.id Cloud`)}
            variant="contained"
          />
        </Demo.Cta>
        <Demo.Preview visual={APP_PREVIEW_DATA.visual} />
      </Demo.Root>

      <Faq.Root>
        <Faq.Intro>
          <Eyebrow colorScheme="secondary">
            <HeadingPart fontFamily="sans">
              {i18n._(msg`Ada pertanyaan?`)}
            </HeadingPart>
          </Eyebrow>
          <Faq.Heading>
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Jangan terhambat pilihan yang terbatas.`)}
            </HeadingPart>
            <br />
            <HeadingPart fontFamily="sans">
              {i18n._(msg`Mulai bangun sistem desa dengan Bades.id`)}
            </HeadingPart>
          </Faq.Heading>
          <Faq.Cta>
            <LinkButton
              color="primary"
              href="https://bades.id/masuk"
              label={i18n._(msg`Mulai sekarang`)}
              variant="contained"
            />
            <TalkToUsButton
              color="primary"
              label={msg`Hubungi kami`}
              variant="outlined"
            />
          </Faq.Cta>
        </Faq.Intro>
        <Faq.Items questions={FAQ_QUESTIONS} />
      </Faq.Root>
    </>
  );
}
