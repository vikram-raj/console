import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { observer } from '@patternfly/react-topology';
import { BaseNode } from '@console/topology/src/components/graph-view';
import { calculateRadius } from '@console/shared';

const managedKafkaIcon = `data:image/svg+xml,%3Csvg id='adffd9f6-a340-4cce-8211-6c0f9298b55f' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 38 38'%3E%3Cdefs%3E%3Cstyle%3E.babc916c-e1fb-432c-82f5-f31008f864ae%7Bfill:red;%7D.bd54039f-1ff7-4ad7-a5a2-655d1144d9f5%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Cpath d='M28,1H10a9,9,0,0,0-9,9V28a9,9,0,0,0,9,9H28a9,9,0,0,0,9-9V10a9,9,0,0,0-9-9Z'/%3E%3Cpath class='babc916c-e1fb-432c-82f5-f31008f864ae' d='M27.4316,14.5173a2.65775,2.65775,0,1,1,2.65807-2.65806A2.66118,2.66118,0,0,1,27.4316,14.5173Zm0-3.70835a1.05061,1.05061,0,1,0,1.05093,1.05029A1.05121,1.05121,0,0,0,27.4316,10.809Z'/%3E%3Cpath class='babc916c-e1fb-432c-82f5-f31008f864ae' d='M23.91472,30.09466a4.88358,4.88358,0,1,1,4.88421-4.883A4.88913,4.88913,0,0,1,23.91472,30.09466Zm0-8.16a3.27644,3.27644,0,1,0,3.27707,3.27707A3.28,3.28,0,0,0,23.91472,21.93464Z'/%3E%3Cpath class='bd54039f-1ff7-4ad7-a5a2-655d1144d9f5' d='M16.97388,26.37187A.80378.80378,0,0,1,16.923,24.766c.19274-.01256.38421-.03139.57318-.05776a.803.803,0,1,1,.22851,1.58957q-.3456.05085-.69873.07282C17.0084,26.37187,16.99083,26.37187,16.97388,26.37187Z'/%3E%3Cpath class='bd54039f-1ff7-4ad7-a5a2-655d1144d9f5' d='M13.41493,25.75161a.81535.81535,0,0,1-.31766-.06529,8.63073,8.63073,0,0,1-1.18338-.62528A.804.804,0,0,1,12.774,23.7025a6.77718,6.77718,0,0,0,.95989.50726.80392.80392,0,0,1-.31892,1.54185ZM9.82209,22.61015a.804.804,0,0,1-.68869-.388,8.46313,8.46313,0,0,1-.59891-1.19782.80323.80323,0,1,1,1.48912-.60268,6.99016,6.99016,0,0,0,.48591.96931.80345.80345,0,0,1-.68743,1.21917Zm-1.08733-4.6444c-.02135,0-.04269-.00062-.06466-.00251a.8034.8034,0,0,1-.737-.86509A8.51376,8.51376,0,0,1,8.144,15.77728a.80351.80351,0,1,1,1.56194.37793,6.92215,6.92215,0,0,0-.17076,1.071A.80391.80391,0,0,1,8.73476,17.96575Zm14.895-2.50425a.803.803,0,0,1-.73577-.48089,6.88007,6.88007,0,0,0-.51354-.95612.80386.80386,0,0,1,1.35352-.86761,8.47972,8.47972,0,0,1,.63156,1.17836.80373.80373,0,0,1-.73577,1.12626ZM10.55912,13.55741a.80353.80353,0,0,1-.6121-1.324,8.61392,8.61392,0,0,1,.94231-.948.8035.8035,0,1,1,1.04841,1.21791,6.987,6.987,0,0,0-.76527.77093A.80322.80322,0,0,1,10.55912,13.55741Zm9.90213-1.66553a.80348.80348,0,0,1-.40932-.11237,6.89571,6.89571,0,0,0-.9737-.47838A.80369.80369,0,0,1,19.67086,9.807a8.59184,8.59184,0,0,1,1.20159.59013.804.804,0,0,1-.4112,1.49476Zm-5.84912-.85379A.80347.80347,0,0,1,14.4194,9.4548a8.62887,8.62887,0,0,1,1.31773-.21972.80351.80351,0,0,1,.14062,1.60086,7.07009,7.07009,0,0,0-1.07163.17829A.79241.79241,0,0,1,14.61213,11.03809Z'/%3E%3Cpath class='bd54039f-1ff7-4ad7-a5a2-655d1144d9f5' d='M24.20853,19.70976a.79414.79414,0,0,1-.11551-.00817.803.803,0,0,1-.68053-.91029q.03956-.27968.0565-.56815a.81994.81994,0,0,1,.84878-.75523.80364.80364,0,0,1,.75585.8494q-.02071.356-.07156.70375A.80311.80311,0,0,1,24.20853,19.70976Z'/%3E%3C/svg%3E%0A`;

const KafkaNode: React.FC<any> = ({
  element,
  selected,
  onSelect,
  tooltipLabel,
  dropTarget,
  canDrop,
  ...props
}) => {
  const { width, height } = element.getBounds();
  const size = Math.min(width, height);
  const iconRadius = Math.min(width, height) * 0.25;
  const { radius, decoratorRadius } = calculateRadius(size);
  const { data } = element.getData();
  return (
    <Tooltip
      content={tooltipLabel}
      trigger="manual"
      isVisible={dropTarget && canDrop}
      animationDuration={0}
    >
      <BaseNode
        className="KafkaNode"
        onSelect={onSelect}
        icon={managedKafkaIcon}
        innerRadius={iconRadius}
        selected={selected}
        kind={data.kind}
        element={element}
        decoratorRadius={decoratorRadius}
        outerRadius={radius}
        {...props}
      />
    </Tooltip>
  );
};

export default observer(KafkaNode);
