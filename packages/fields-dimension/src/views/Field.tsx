/** @jsx jsx */

import copy from 'copy-to-clipboard';
import bytes from 'bytes';
import { Fragment, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react';

import { jsx, Stack, useTheme, Text, VisuallyHidden } from '@keystone-ui/core';
import { TextInput } from '@keystone-ui/fields';

import { FieldContainer, FieldLabel, Select } from '@keystone-ui/fields';
import { SegmentedControl } from '@keystone-ui/segmented-control';

import { Pill } from '@keystone-ui/pill';
import { Button } from '@keystone-ui/button';
import { FieldProps } from '@keystone-next/types';
import { DimensionValue } from './index';

export function Field({
  autoFocus,
  field,
  value,
  forceValidation,
  onChange,
}: FieldProps<typeof import('.').controller>) {
  console.log(value);

  const errorMessage = createErrorMessage(value);
  const error = forceValidation && errorMessage ? errorMessage : undefined;
  const handleChange = (field: string, data: string | undefined) => {
    console.log(data);
    onChange?.({
      ...value,
      [field]: data,
    } as DimensionValue);
  };

  return (
    <FieldContainer as="fieldset">
      <FieldLabel as="legend">{field.label}</FieldLabel>
      <Fragment>
        {field.displayMode === 'select' ? (
          <Fragment>
            <FieldLabel htmlFor={field.path}>Unit</FieldLabel>
            <Select
              id={field.path}
              isClearable
              autoFocus={autoFocus}
              options={field.units}
              isDisabled={onChange === undefined}
              defaultValue={field.units.find(u => u.value === field.defaultUnit)}
              onChange={option => {
                handleChange('unit', option?.value);
              }}
              value={field.units.find(u => value?.unit == u.value) || null}
              portalMenu
            />
          </Fragment>
        ) : (
          <Fragment>
            <FieldLabel as="legend">{field.label}</FieldLabel>
            <SegmentedControl
              segments={field.units.map(x => x.label)}
              selectedIndex={
                value
                  ? field.units.findIndex(x => x.value === value.unit)
                  : field.units.findIndex(x => x.value === field.defaultUnit)
              }
              onChange={index => {
                handleChange('unit', field.units[index].value);
              }}
            />
          </Fragment>
        )}
        <Stack
          gap="small"
          across
          css={{
            width: '100%',
            justifyContent: 'space-between',
            'div:first-of-type': {
              flex: '2',
            },
          }}
        >
          <TextInput
            id={`${field.path}--length`}
            autoFocus
            placeholder="Length"
            onChange={event =>
              handleChange('length', event.target.value.replace(/[^\d\.,\s-]/g, ''))
            }
            value={value?.length}
            css={{
              width: '100%',
            }}
          />
          <TextInput
            id={`${field.path}--width`}
            placeholder="Width"
            value={value?.width}
            onChange={event =>
              handleChange('width', event.target.value.replace(/[^\d\.,\s-]/g, ''))
            }
            css={{
              width: '100%',
            }}
          />
          <TextInput
            id={`${field.path}--height`}
            placeholder="Height"
            value={value?.height}
            onChange={event =>
              handleChange('height', event.target.value.replace(/[^\d\.,\s-]/g, ''))
            }
            css={{
              width: '100%',
            }}
          />
          {error ? (
            <Pill weight="light" tone="negative">
              {error}
            </Pill>
          ) : null}
        </Stack>
      </Fragment>
    </FieldContainer>
  );
}

function createErrorMessage(value: DimensionValue) {
  return validateDimension(value);
}

export function validateDimension(data: DimensionValue): string | undefined {
  if (data) {
    const { unit, length, width, height } = data;
    if (!unit || length < 0 || width < 0 || height < 0) return 'Must provide details';
  }
}
