import { msg } from '@lingui/core/macro';
import { HELPED_CARDS } from '@/app/[locale]/(home)/helped.data';
import { APP_PREVIEW_DATA } from '@/app/[locale]/(home)/app-preview.data';
import { Problem, type ProblemPointType } from '@/sections/Problem';
import { HOME_TESTIMONIALS } from '@/app/[locale]/(home)/testimonials.data';
import { FEATURE_CARDS } from '@/app/[locale]/(home)/three-cards-feature.data';
import { ILLUSTRATION_CARDS } from '@/app/[locale]/(home)/three-cards-illustration.data';
import { TalkToUsButton } from '@/sections/ContactCal';
import { Faq, FAQ_QUESTIONS } from '@/sections/Faq';
import { TRUSTED_BY_LOGOS, TrustedBy } from '@/sections/TrustedBy';
import {
  Body,
  Eyebrow,
  Heading,
  HeadingPart,
  LinkButton,
} from '@/design-system/components';
import { fetchCommunityStats } from '@/lib/community/fetch-community-stats';
import {
  getRouteI18n,
  type LocaleRouteParams,
} from '@/lib/i18n/utils/get-route-i18n';
import { Pages } from '@/lib/pages';
import { mergeSocialLinkLabels } from '@/lib/community/merge-social-link-labels';
import { Helped } from '@/sections/Helped';
import { Hero } from '@/sections/Hero';
import { HomeStepper, type HomeStepperStepType } from '@/sections/HomeStepper';
import { Menu, MENU_DATA } from '@/sections/Menu';
import { Testimonials } from '@/sections/Testimonials';
import { ThreeCards } from '@/sections/ThreeCards';
import { buildFaqPageJsonLd, buildRouteMetadata, JsonLd } from '@/lib/seo';
import { theme } from '@/theme';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const generateMetadata = buildRouteMetadata('home');

const HOME_TOP_BACKGROUND_COLOR = '#F4F4F4';

const HeroHeadingGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};
  width: 100%;

  > *:last-child {
    margin-top: 0;
  }
`;

const HeroIntroGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(8)};
  width: 100%;
`;

const ThreeCardsIllustrationIntroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: ${theme.spacing(2)};
  width: 100%;
`;

const ThreeCardsIllustrationIntroHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: ${theme.spacing(6)};
  width: 100%;
`;

const threeCardsIllustrationHeadingClassName = css`
  width: 100%;

  @media (min-width: ${theme.breakpoints.md}px) {
    max-width: ${theme.layout.editorial};
  }

  [data-family='sans'] {
    letter-spacing: -0.02em;
  }
`;

const threeCardsIllustrationBodyClassName = css`
  width: 100%;

  @media (min-width: ${theme.breakpoints.md}px) {
    max-width: 571px;
  }
`;

type HomePageProps = {
  params: Promise<LocaleRouteParams>;
};

export default async function HomePage({ params }: HomePageProps) {
  const [i18n, stats] = await Promise.all([
    getRouteI18n(params),
    fetchCommunityStats(),
  ]);

  const PROBLEM_POINTS: ProblemPointType[] = [
    {
      heading: (
        <HeadingPart fontFamily="sans">
          {i18n._(msg`The Giant Monolith`)}
        </HeadingPart>
      ),
      body: msg`Proprietary languages, slow deployment cycles, and "black box" logic.`,
    },
    {
      heading: (
        <HeadingPart fontFamily="sans">
          {i18n._(msg`The In-house Burden`)}
        </HeadingPart>
      ),
      body: msg`It's fragile. V1 ships quickly, but maintaining and making changes is a long term burden.`,
    },
  ];

  const HOME_STEPPER_STEPS: HomeStepperStepType[] = [
    {
      heading: (
        <Heading size="lg" weight="light">
          <HeadingPart fontFamily="serif">
            {i18n._(msg`Begin with production-grade`)}
          </HeadingPart>{' '}
          <HeadingPart fontFamily="sans">
            {i18n._(msg`building blocks`)}
          </HeadingPart>
        </Heading>
      ),
      body: msg`Bangun aplikasi dan layanan desa dengan seperangkat alat yang fleksibel. Model data, tata letak, dan alur kerja.`,
    },
    {
      heading: (
        <Heading size="lg" weight="light">
          <HeadingPart fontFamily="serif">
            {i18n._(msg`Continue iteration`)}
          </HeadingPart>{' '}
          <HeadingPart fontFamily="sans">
            {i18n._(msg`without friction`)}
          </HeadingPart>
        </Heading>
      ),
      body: msg`Kustomisasi tanpa batas sesuai kebutuhan desa Anda. Mudah digunakan, cepat beradaptasi.`,
    },
    {
      heading: (
        <Heading size="lg" weight="light">
          <HeadingPart fontFamily="serif">
            {i18n._(msg`Stay in control with our`)}
          </HeadingPart>{' '}
          <HeadingPart fontFamily="sans">
            {i18n._(msg`open-source software`)}
          </HeadingPart>
        </Heading>
      ),
      body: msg`Jangan terkunci di ekosistem orang lain. Bades.id mudah disetup, dengan data asli, pengujian langsung, dan tanpa tool proprietary.`,
    },
  ];
  const menuSocialLinks = mergeSocialLinkLabels(MENU_DATA.socialLinks, stats);

  return (
    <>
      <JsonLd data={buildFaqPageJsonLd(FAQ_QUESTIONS, (d) => i18n._(d))} />
      {/*
       * Above-the-fold home hero background texture. Preload warms the
       * HTTP cache so it is ready by the time HomeBackgroundHalftone
       * binds it to the WebGL pipeline.
       */}
      <link
        as="image"
        fetchPriority="high"
        href="/illustrations/generated/home-background-bridge.png"
        rel="preload"
      />
      <link
        rel="prefetch"
        href="/illustrations/home/helped/target.glb"
        as="fetch"
      />
      <link
        rel="prefetch"
        href="/illustrations/home/helped/spaceship.glb"
        as="fetch"
      />
      <link
        rel="prefetch"
        href="/illustrations/home/helped/money.glb"
        as="fetch"
      />
      <Menu.Root
        backgroundColor={HOME_TOP_BACKGROUND_COLOR}
        scheme="primary"
        navItems={MENU_DATA.navItems}
        socialLinks={menuSocialLinks}
      >
        <Menu.Logo scheme="primary" />
        <Menu.Nav scheme="primary" navItems={MENU_DATA.navItems} />
        <Menu.Social scheme="primary" socialLinks={menuSocialLinks} />
        <Menu.Cta scheme="primary" />
      </Menu.Root>

      <Hero.Root scheme="muted" showHomeBackground>
        <HeroIntroGroup data-halftone-exclude>
          <HeroHeadingGroup>
            <Hero.Heading page={Pages.Home}>
              <HeadingPart fontFamily="serif">
                {i18n._(msg`Sistem Informasi Desa`)}
              </HeadingPart>{' '}
              <HeadingPart fontFamily="sans">
                {i18n._(msg`untuk Indonesia`)}
              </HeadingPart>
            </Hero.Heading>
            <Hero.Body page={Pages.Home} size="sm">
              {i18n._(
                msg`Bades.id menyediakan blok bangunan untuk sistem informasi desa yang memenuhi kebutuhan admin desa Indonesia dan cepat beradaptasi.`,
              )}
            </Hero.Body>
          </HeroHeadingGroup>
          <Hero.Cta>
            <LinkButton
              color="secondary"
              href="https://bades.id/masuk"
              label={i18n._(msg`Get started`)}
              variant="contained"
            />
            <TalkToUsButton
              color="secondary"
              label={msg`Talk to us`}
              variant="outlined"
            />
          </Hero.Cta>
        </HeroIntroGroup>
        <Hero.AppPreview visual={APP_PREVIEW_DATA.visual} />
      </Hero.Root>

      <TrustedBy.Root
        separator={i18n._(msg`trusted by`)}
        logos={TRUSTED_BY_LOGOS}
        clientCount={i18n._(msg`+10k others`)}
      />

      <Problem.Root>
        <Problem.Visual />
        <Problem.Content>
          <Eyebrow>
            <HeadingPart fontFamily="sans">
              {i18n._(msg`The Problem.`)}
            </HeadingPart>
          </Eyebrow>
          <Problem.Heading>
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Sistem Informasi Desa memberi keunggulan,`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`but building one`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="serif">
              {i18n._(msg`comes with`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`tradeoffs`)}
            </HeadingPart>
          </Problem.Heading>
          <Problem.Points points={PROBLEM_POINTS} />
        </Problem.Content>
      </Problem.Root>

      <ThreeCards.Root scheme="light">
        <ThreeCards.Intro page={Pages.Home} align="left">
          <ThreeCardsIllustrationIntroContent>
            <ThreeCardsIllustrationIntroHeader>
              <Eyebrow>
                <HeadingPart fontFamily="sans">
                  {i18n._(msg`Stop settling for trade-offs.`)}
                </HeadingPart>
              </Eyebrow>
              <Heading
                className={threeCardsIllustrationHeadingClassName}
                size="lg"
                weight="light"
              >
                <HeadingPart fontFamily="serif">
                  {i18n._(msg`Rakit, iterasi, dan sesuaikan sistem yang robust,`)}
                </HeadingPart>{' '}
                <HeadingPart fontFamily="sans">
                  {i18n._(msg`that's quick to flex`)}
                </HeadingPart>
              </Heading>
            </ThreeCardsIllustrationIntroHeader>
            <Body className={threeCardsIllustrationBodyClassName} size="sm">
              {i18n._(
                msg`Compose your CRM and internal apps with a single extensibility toolkit.`,
              )}
            </Body>
          </ThreeCardsIllustrationIntroContent>
        </ThreeCards.Intro>
        <ThreeCards.IllustrationCards illustrationCards={ILLUSTRATION_CARDS} />
      </ThreeCards.Root>

      <HomeStepper.ScrollSection steps={HOME_STEPPER_STEPS} />

      <ThreeCards.Root scheme="light">
        <ThreeCards.Intro page={Pages.Home} align="center">
          <Eyebrow>
            <HeadingPart fontFamily="sans">
              {i18n._(msg`Skip the clunky UX that always comes with custom.`)}
            </HeadingPart>
          </Eyebrow>
          <Heading size="lg" weight="light">
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Buat tim operasional Anda puas`)}
            </HeadingPart>
            <br />
            <HeadingPart fontFamily="serif">
              {i18n._(msg`with`)}
            </HeadingPart>{' '}
            <HeadingPart fontFamily="sans">
              {i18n._(msg`sistem yang akan mereka sukai`)}
            </HeadingPart>
          </Heading>
        </ThreeCards.Intro>
        <ThreeCards.FeatureCards featureCards={FEATURE_CARDS} />
      </ThreeCards.Root>

      <Helped.Root scheme="muted">
        <Helped.Scene cards={HELPED_CARDS} />
      </Helped.Root>

      <Testimonials.Root scheme="muted">
        <Testimonials.Carousel
          eyebrow={i18n._(msg`Mereka adalah pengguna sebenarnya`)}
          testimonials={HOME_TESTIMONIALS}
        >
          <Testimonials.HourglassVisual />
        </Testimonials.Carousel>
      </Testimonials.Root>

      <Faq.Root>
        <Faq.Intro>
          <Eyebrow colorScheme="secondary">
            <HeadingPart fontFamily="sans">
              {i18n._(msg`Any Questions?`)}
            </HeadingPart>
          </Eyebrow>
          <Faq.Heading>
            <HeadingPart fontFamily="serif">
              {i18n._(msg`Stop fighting custom.`)}
            </HeadingPart>
            <br />
            <HeadingPart fontFamily="sans">
              {i18n._(msg`Start building, with Bades.id`)}
            </HeadingPart>
          </Faq.Heading>
          <Faq.Cta>
            <LinkButton
              color="primary"
              href="https://bades.id/masuk"
              label={i18n._(msg`Get started`)}
              variant="contained"
            />
            <TalkToUsButton
              color="primary"
              label={msg`Talk to us`}
              variant="outlined"
            />
          </Faq.Cta>
        </Faq.Intro>
        <Faq.Items questions={FAQ_QUESTIONS} />
      </Faq.Root>
    </>
  );
}
