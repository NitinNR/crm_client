import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import {
  Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, RadioGroup, FormControlLabel, Radio,
  FormControl, FormLabel
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../components/hook-form';

// NR

// <=


// desk service

import deskUserService from '../../services/desk.user.service';
// ----------------------------------------------------------------------

const GENDER_OPTION = ['Men', 'Women', 'Kids'];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

BroadcastNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBroadcast: PropTypes.object,
};

const mytz = Intl.DateTimeFormat().resolvedOptions().timeZone;


export default function BroadcastNewForm({ userId, spaceId, bid, isEdit, currentBroadcast, createBroadcast, updateBroadcast }) {

  // NR
  const [audienceType, setAudienceType] = useState("0")
  // <= NR

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [yupValidation, setYupvalidation] = useState(Yup.object().shape({
    title: Yup.string().required('Title is required'),
    inbox: Yup.string().required('Inbox is required'),
    template: Yup.string().required('Template is required'),
    scheduleDate: Yup.date().required("Schedule date is required"),
    audienceType: Yup.string().required('Audience type is required'),
    audience: Yup.array().min(1, 'Audience is required'),
  }))

  const defaultValues = useMemo(
    () => ({
      title: currentBroadcast?.old_brodcast?.title || '',
      inbox: currentBroadcast?.old_brodcast?.inbox_id || '',
      template: currentBroadcast?.old_brodcast?.template_id || '',
      scheduleDate: currentBroadcast?.old_brodcast?.schedule_at ? new Date(currentBroadcast?.old_brodcast?.schedule_at) : null,
      audienceType: currentBroadcast?.old_brodcast?.audience_type?.toString() || audienceType,
      audience: audienceType === "0" ? (currentBroadcast?.old_brodcast?.audience || []) : (currentBroadcast.old_brodcast?.audience || ""),
    }),
    [currentBroadcast]
  );

  // VALIDATORS
  const methods = useForm({
    resolver: yupResolver(yupValidation),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;


  const values = watch();


  useEffect(async () => {
    if (isEdit && currentBroadcast) {
      await inboxChanged(currentBroadcast?.old_brodcast.inbox_id)
      if (currentBroadcast?.old_brodcast?.audience_type) {
        const audType = currentBroadcast.old_brodcast.audience_type.toString()


        setYupvalidation(pre => {
          let newSchema = Yup.array().min(1, 'Audience is required');
          if (audType === "1") {
            newSchema = Yup.string().required('Audience is required');
          }
          return Yup.object().shape({
            ...pre.fields,
            audience: newSchema,
          })
        })

        setAudienceType(currentBroadcast.old_brodcast.audience_type.toString())
      }
      // setWtemplatemessage(true)
      // createTemplateMessageComponent()

    }
    reset(defaultValues);
  }, [isEdit, currentBroadcast]);

  const onSubmit = async () => {
    try {
      if (!isEdit) {
        // console.log(values);

        const new_broadcast_status = await createBroadcast(userId, values, mytz);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (new_broadcast_status.data.status === 400) {
          enqueueSnackbar('Broadcast Creation failed !');
        } else {
          enqueueSnackbar('Broadcast Created successfully!');
          navigate(PATH_DASHBOARD.broadcast.schedule);

        }

      } else {
        const update_broadcast_status = await updateBroadcast(userId, bid, values);
        if (update_broadcast_status.status === 200) {
          enqueueSnackbar('Broadcast Updated successfully!');
          await new Promise((resolve) => setTimeout(resolve, 500));
          navigate(PATH_DASHBOARD.broadcast.schedule);
        } else {
          enqueueSnackbar('Broadcast Updation failed !');
        }

      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  // NR
  const handleAudienceTypeChange = (e) => {

    setYupvalidation(pre => {
      let newSchema = null
      if (e.target.value === "1") {
        setValue('audience', "")
        newSchema = Yup.string().required('Audience is required');
      } else if ((e.target.value === "2")) {

        setValue('audience', "")
        newSchema = Yup.string().notRequired()

      } else {
        newSchema = Yup.array().min(1, 'Audience is required');
        setValue('audience', [])
      }
      return Yup.object().shape({
        ...pre.fields,
        audience: newSchema,
      })
    }
    )
    setValue('audienceType', e.target.value)
    setAudienceType(e.target.value)
    // reset(defaultValues);
  }

  const [wtemplates, setTemplates] = useState([])
  const inboxChanged = async (inboxId) => {
    const selectedInbox = currentBroadcast.inboxes[0].classify.filter(el => el.id === parseInt(inboxId, 10));
    if (selectedInbox.length > 0) {
      const channelId = selectedInbox[0].channel_id;
      const templates = await deskUserService.getTeplateData(userId, spaceId, channelId)
      let whatsappTemps = templates.data[0].message_templates;

      whatsappTemps = whatsappTemps.filter(el => {
        let filterelement = {}
        // console.log("el.components:",el.components);
        if (el.components[0].format === "TEXT" && !el.components[1].text.includes("{{1}}")) {

          filterelement = el
        }
        return filterelement
      })

      if (whatsappTemps.length > 0) {

        setTemplates(whatsappTemps)
      } else {

        setTemplates(templates)
      }
    }
  }


  // Function to remove fields with keys following "var-{digit}" format
  const removeFieldsWithSpecificFormat = (schema, format) => {
    const strippedSchema = Object.keys(schema.fields).reduce((acc, fieldKey) => {
      if (!fieldKey.startsWith(format)) {
        acc.fields[fieldKey] = schema.fields[fieldKey];
      }
      return acc;
    }, Yup.object());

    return strippedSchema;
  };


  // template part code
  const [wtemplatemessage, setWtemplatemessage] = useState(false);
  const [templatePayload, settemplatePayload] = useState([]);
  const templateChange = (templateId) => {


    const wtemp = wtemplates?.filter(el => el.id === templateId)

    const templateStatus = wtemp[0]?.status
    if (templateStatus === "APPROVED") {
      setWtemplatemessage(true)
      // setInputFields([])

      // console.log("TEMPLATES", wtemp);
      settemplatePayload(wtemp[0].components);
    } else {
      setWtemplatemessage(false)
    }
  }

  const createTemplateMessageComponent2 = () => {

    return (
      <>
        {templatePayload.map((element, index) => {

          if (element.type === "HEADER") {
            return <Typography key={element.text} variant='subtitle1'>{element.text}</Typography>;
          }
          if (element.type === "BODY") {
            return <Typography key={element.text} variant='body1'>{element.text.replace('{{1}}', <TextField id="filled-basic" label="Filled" variant="filled" />)}</Typography>;
          }
          if (element.type === "FOOTER") {
            return <Typography key={element.text} variant='body2'>{element.text}</Typography>;
          }
          return null;
        })}
      </>
    )

  }

  // const [template_variable_values, setTemplate_variable_values] = useState([])
  const [InputFields, setInputFields] = useState([])

  const createTemplateMessageComponent = () => {
    // console.log("templatePayload", templatePayload, "\n Values",values);

    const renderInputField = (varvalue,labeltext) => (
      <TextField size="small" id={`var_${varvalue}`} label={labeltext} variant="outlined" onChange={(e) => { setValue(`var_${varvalue}`, e.target.value); }} />
    );

    const inputFields = []

    templatePayload.forEach((element, index) => {
      if(element.type === "HEADER"){
        if(element.format === "IMAGE"){
          inputFields.push(renderInputField("image","Image url (png,jpeg)"));
        }else if(element.format === "VIDEO"){
          inputFields.push(renderInputField("video","Video file(NF)"));
        }else if(element.format === "DOCUMENT"){
          inputFields.push(renderInputField("document","Document file(NF)"));
        }
        
      }
      else if (element.type === "BODY") {
        const parts = element.text.split(/{{\d+}}/);
        parts.forEach((part, partIndex) => {
          if (partIndex < parts.length - 1) {
            inputFields.push(renderInputField(partIndex + 1,partIndex + 1));
          }
        });
        // setInputFields(inputFields)

      } 
    });

    // const strippedSchema = removeFieldsWithSpecificFormat(yupValidation, 'var-');
    // setYupvalidation(strippedSchema);

    return (
      <>
        <LabelStyle>Template content</LabelStyle>
        {templatePayload.map((element, index) => {

          if (element.type === "HEADER") {
            return <Typography key={index} variant='subtitle1'>{element.text}</Typography>;
          }

          if (element.type === "BODY") {
            return <Typography key={index} variant='body1'>{element.text}</Typography>;
          }
          if (element.type === "FOOTER") {
            return <Typography key={index} variant='body2'>{element.text}</Typography>;
          }
          return null;
        })}

        <div style={{ marginTop: '10px' }}>
          <LabelStyle>Template Variables</LabelStyle>
          {inputFields.map((inputField, index) => (
            <div key={`input-${index}`} style={{ marginBottom: '4px' }}>
              {inputField}
            </div>
          ))}
        </div>

      </>
    );
  };



  const manageaudienceView = () => {

    let audienceComponent = ""

    if (audienceType === "0") {
      audienceComponent = <Controller
        name="audience"
        control={control}
        render={({ field }) => (
          <Autocomplete
            value={field.audience}
            {...field}
            multiple
            freeSolo
            onChange={(event, newValue) => { field.onChange(newValue); setValue('audience', newValue); }}
            // onChange={(event, newValue) => setAudience(newValue)}
            options={currentBroadcast.tags_option.map((option) => option.title)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
              ))
            }
            renderInput={(params) => <TextField label="Audience" {...params} />}
          />
        )}
      />
    } else if (audienceType === "1") {
      audienceComponent = <Controller
        name="audience"
        control={control}
        // defaultValue={currentBroadcast?.old_brodcast?.audience?.replace(",","\n")||"test"}
        render={({ field }) => (
          <TextField
            // name="audience"
            value={field.value}
            label="Audience contacts"
            placeholder="Phone numbers"
            onChange={(e) => { field.onChange(e.target.value); setValue('audience', e.target.value); }}
            multiline
            maxRows={2}
          />)}
      />
    }
    return audienceComponent;

  }
  // <=

  // const [isDisable, setIsDisable] = useState(true)

  // <= NR

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Broadcast title" />

              {/* INBOX */}
              <div>

                <RHFSelect name="inbox" label="Inbox" onChange={(e) => { setValue('inbox', e.target.value); inboxChanged(e.target.value) }}>
                  <option aria-label="None" value='' />
                  {currentBroadcast?.inboxes.map((category) => (

                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify.id} value={classify.id}>
                          {classify.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>

              </div>

              {/* TEMPLATE */}
              <div>
                <RHFSelect name="template" label="Select Template" onChange={(e) => { setValue('template', e.target.value); templateChange(e.target.value) }}>
                  <option aria-label="None" value='' />
                  {wtemplates.map((wt) => (

                    <option key={wt.id} value={wt.id}>
                      {wt.name}
                    </option>

                  ))}
                </RHFSelect>

              </div>
              {/* TEMPLATE CONTENT */}
              <div>
                {/* <LabelStyle>Template content</LabelStyle> */}
                {wtemplatemessage ? createTemplateMessageComponent() : null}
                {/* <LabelStyle>Message content</LabelStyle> */}
                {/* <RHFEditor simple name="description" /> */}
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              {/* <RHFSwitch name="inStock" label="In stock" /> */}

              <Stack spacing={3} mt={2}>

                {/* Audience type */}
                <div>
                  <FormControl
                    name="audienceType"
                  >
                    <FormLabel>Audience type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      value={audienceType}
                      // defaultValue={audienceType}
                      name="audienceType"
                      onChange={handleAudienceTypeChange}
                    >
                      <FormControlLabel value="0" control={<Radio />} label="Tag based" />
                      <FormControlLabel value="1" control={<Radio />} label="Custom" />
                      <FormControlLabel value="2" control={<Radio />} label="All" />

                    </RadioGroup>
                  </FormControl>
                </div>
                {/* Audience */}
                {
                  manageaudienceView()
                }
                {errors.audience && <Typography color="error">{errors.audience.message}</Typography>}
                {errors && <Typography color="error">{errors[0]}</Typography>}
              </Stack>
            </Card>

            {/* schedule */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <Controller
                  name="scheduleDate"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDateTimePicker
                        disablePast
                        {...field}
                        label="schedule date"
                        inputFormat="DD/MM/YY hh:mm a"
                        renderInput={(params) => <TextField  {...params} fullWidth />}
                        onChange={(e) => {
                          field.onChange(e); setValue('scheduleDate', e);
                        }}

                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.scheduleDate && <Typography color="error">{errors.scheduleDate.message}</Typography>}

                {/* <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0.00"
                  value={getValues('priceSale') === 0 ? '' : getValues('priceSale')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                /> */}
              </Stack>

              {/* <RHFSwitch name="taxes" label="Price includes taxes" /> */}
            </Card>

            {
              isEdit ? (<LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Changes
              </LoadingButton>) : <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Create Broadcast
              </LoadingButton>
            }
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
