import { SubTitle } from '@/auth/components/SubTitle';
import { Title } from '@/auth/components/Title';
import { SubscriptionBenefit } from '@/settings/billing/components/SubscriptionBenefit';
import { ENTERPRISE_CHECKOUT_SESSION } from '@/settings/enterprise/graphql/queries/enterpriseCheckoutSession';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ModalStatefulWrapper } from '@/ui/layout/modal/components/ModalStatefulWrapper';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { useApolloClient } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { Loader } from 'ui/feedback';
import { CardPicker, MainButton } from 'ui/input';
import { ModalContent } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

export const ENTERPRISE_PLAN_MODAL_ID = 'enterprise-plan-modal';

type BillingInterval = 'monthly' | 'yearly';

const MONTHLY_PRICE = 25;
const YEARLY_PRICE = 19;

const StyledSubscriptionContainer = styled.div`
  background-color: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-direction: column;
  margin: ${themeCssVariables.spacing[8]} 0 ${themeCssVariables.spacing[2]};
  width: 100%;
`;

const StyledPriceContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  margin: ${themeCssVariables.spacing[4]} ${themeCssVariables.spacing[3]} 0
    ${themeCssVariables.spacing[4]};
  padding-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledPrice = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

const StyledPriceUnit = styled.span`
  color: ${themeCssVariables.font.color.light};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledBenefitsContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: ${themeCssVariables.spacing[4]} ${themeCssVariables.spacing[3]};
  width: 100%;
`;

const StyledIntervalContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[2]};
  margin-bottom: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StyledIntervalCardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledIntervalTitle = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledIntervalSubtitle = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.md};
`;

export const EnterprisePlanModal = () => {
  const { t } = useLingui();
  const { closeModal } = useModal();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [selectedInterval, setSelectedInterval] =
    useState<BillingInterval>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const client = useApolloClient();

  const benefits = [
    ""SSO (SAML / OIDC)",
    ""Row-level security",
    ""Audit logs",
    ""Advanced Encryption",
    ""Custom AI Models",
  ];

  const price = selectedInterval === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE;
  const priceUnit =
    selectedInterval === 'monthly'
      ? ""seat / month"
      : ""seat / month - billed yearly";

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      const { data } = await client.query<{
        enterpriseCheckoutSession: string | null;
      }>({
        query: ENTERPRISE_CHECKOUT_SESSION,
        variables: { billingInterval: selectedInterval },
      });

      const checkoutUrl = data?.enterpriseCheckoutSession;

      if (checkoutUrl !== null && checkoutUrl !== undefined) {
        window.open(checkoutUrl, '_blank', 'noopener');
        closeModal(ENTERPRISE_PLAN_MODAL_ID);
      } else {
        enqueueErrorSnackBar({
          message: ""Could not open Stripe. Please contact support.",
        });
      }
    } catch {
      enqueueErrorSnackBar({
        message: ""Error opening Stripe",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalStatefulWrapper
      modalInstanceId={ENTERPRISE_PLAN_MODAL_ID}
      size="medium"
      padding="none"
      isClosable
    >
      <ModalContent isVerticallyCentered>
        <Title noMarginTop>{""Get Enterprise"}</Title>
        <SubTitle>{""Enjoy a 30-day free trial"}</SubTitle>

        <StyledSubscriptionContainer>
          <StyledPriceContainer>
            <StyledPrice>{`$${price}`}</StyledPrice>
            <StyledPriceUnit>{priceUnit}</StyledPriceUnit>
          </StyledPriceContainer>
          <StyledBenefitsContainer>
            {benefits.map((benefit) => (
              <SubscriptionBenefit key={benefit}>{benefit}</SubscriptionBenefit>
            ))}
          </StyledBenefitsContainer>
        </StyledSubscriptionContainer>

        <StyledIntervalContainer>
          <CardPicker
            checked={selectedInterval === 'monthly'}
            handleChange={() => setSelectedInterval('monthly')}
          >
            <StyledIntervalCardContent>
              <StyledIntervalTitle>{"Bulanan"}</StyledIntervalTitle>
              <StyledIntervalSubtitle>{`$${MONTHLY_PRICE} / ${""seat / month"}`}</StyledIntervalSubtitle>
            </StyledIntervalCardContent>
          </CardPicker>
          <CardPicker
            checked={selectedInterval === 'yearly'}
            handleChange={() => setSelectedInterval('yearly')}
          >
            <StyledIntervalCardContent>
              <StyledIntervalTitle>{""Yearly"}</StyledIntervalTitle>
              <StyledIntervalSubtitle>{`$${YEARLY_PRICE} / ${""seat / month"}`}</StyledIntervalSubtitle>
            </StyledIntervalCardContent>
          </CardPicker>
        </StyledIntervalContainer>

        <MainButton
          title={"Lanjutkan"}
          onClick={handleContinue}
          width={200}
          Icon={() => isLoading && <Loader />}
          disabled={isLoading}
        />
      </ModalContent>
    </ModalStatefulWrapper>
  );
};
