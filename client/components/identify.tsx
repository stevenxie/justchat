import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";

import { Box, BoxProps, VStack } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Input, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

import { IdentifyUserMutation, IdentifyUserMutationVariables } from "schema";

const IDENTIFY_USER_MUTATION = gql`
  mutation IdentifyUserMutation($input: IdentifyUserInput!) {
    identifyUser(input: $input) {
      id
      name
    }
  }
`;

export interface IdentifyProps extends BoxProps {
  roomId: string;
  // roomSecret: string | null;
  onIdentify: (userId: string) => void;
}

interface IdentifyFieldValues {
  name: string;
}

export const Identify: FC<IdentifyProps> = ({
  roomId,
  // roomSecret,
  onIdentify,
  ...otherProps
}) => {
  const toast = useToast({
    position: "bottom",
    isClosable: true,
  });

  const [identifyUser, { loading: isLoading }] = useMutation<
    IdentifyUserMutation,
    IdentifyUserMutationVariables
  >(IDENTIFY_USER_MUTATION, {
    onCompleted: ({ identifyUser: { id: userId } }) => onIdentify(userId),
    onError: error => {
      toast({
        status: "error",
        title: "Failed to create user",
        description: error.toString(),
      });
    },
  });

  const {
    handleSubmit,
    register,
    errors,
    formState: { isValid },
  } = useForm<IdentifyFieldValues>({
    mode: "all",
  });
  const onSubmit = handleSubmit(({ name }) => {
    identifyUser({
      variables: {
        input: {
          roomId,
          // roomSecret,
          name,
        },
      },
    });
  });

  return (
    <VStack as="form" align="stretch" {...otherProps}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          ref={register({
            required: true,
            minLength: {
              value: 3,
              message: "Too short (minimum 3 characters).",
            },
            maxLength: {
              value: 128,
              message: "Too long.",
            },
          })}
          name="name"
          type="text"
          placeholder="Ass Man"
          isRequired
          minLength={3}
          maxLength={128}
        />
        {errors.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <Button
        type="submit"
        colorScheme="pink"
        isLoading={isLoading}
        isDisabled={!isValid}
        onClick={onSubmit}
      >
        Next
      </Button>
    </VStack>
  );
};
