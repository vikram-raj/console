import * as React from 'react';
import * as _ from 'lodash';
// FIXME upgrading redux types is causing many errors at this time
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { Switch } from '@patternfly/react-core';
import { AlertStates, Rule, RuleStates } from '@console/internal/components/monitoring/types';
import { StateTimestamp } from '@console/internal/components/monitoring/alerting';
import { coFetchJSON } from '@console/internal/co-fetch';
import SilenceDurationDropDown from './SilenceDurationDropdown';
import { RootState } from '@console/internal/redux';
import { monitoringSetRules } from '@console/internal/actions/ui';
import { errorModal } from '@console/internal/components/modals';

type SilenceAlertProps = {
  rule: Rule;
};

const { alertManagerBaseURL } = window.SERVER_FLAGS;

const SilenceUntil = ({ rule }) => {
  if (!_.isEmpty(rule.silencedBy)) {
    return (
      <div onClick={(e) => e.preventDefault()} role="presentation">
        <StateTimestamp text="Until" timestamp={_.max(_.map(rule.silencedBy, 'endsAt'))} />
      </div>
    );
  }
  return null;
};

const SilenceAlert: React.FC<SilenceAlertProps> = ({ rule }) => {
  const [isChecked, setIsChecked] = React.useState(true);
  const [isInprogress, setIsInprogress] = React.useState(false);
  const rules = useSelector((state: RootState) => state.UI.getIn(['monitoring', 'devRules']));
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (rule.state === RuleStates.Silenced) {
      setIsChecked(false);
    }
  }, [rule]);

  const handleChange = (checked: boolean) => {
    if (checked) {
      _.each(rule.silencedBy, (silence) => {
        coFetchJSON
          .delete(`${alertManagerBaseURL}/api/v2/silence/${silence.id}`)
          .then(() => {
            _.each(rule.alerts, (a) => {
              _.omit(a, 'silencedBy');
              a.state = AlertStates.NotFiring;
            });
            _.omit(rule, 'silencedBy');
            rule.state = RuleStates.Inactive;
            const ruleIndex = rules.findIndex((r) => r.id === rule.id);
            const updatedRules = _.cloneDeep(rules);
            updatedRules.splice(ruleIndex, 1, rule);
            dispatch(monitoringSetRules('devRules', updatedRules, 'dev'));
            setIsChecked(true);
          })
          .catch((err) => {
            errorModal({ error: err?.message });
            setIsChecked(false);
          });
      });
    }
    setIsChecked(checked);
  };

  return (
    <Switch
      aria-label="Silence switch"
      className="odc-silence-alert"
      label={null}
      labelOff={
        rule.state === RuleStates.Silenced && !isChecked ? (
          <SilenceUntil rule={rule} />
        ) : (
          <SilenceDurationDropDown
            silenceInProgress={(progress) => setIsInprogress(progress)}
            rule={rule}
          />
        )
      }
      isDisabled={isInprogress}
      isChecked={isChecked}
      onChange={handleChange}
    />
  );
};

export default SilenceAlert;
