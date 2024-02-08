import { useState } from "react";
import { View, Text, ScrollView, Alert, Linking } from "react-native";

import { useNavigation } from "expo-router";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useCartStore } from "@/stores/cartStore";

import { formatCurrency } from "@/utils/functions/formatCurrency";
import { ProductProps } from "@/utils/data/products";

import { Feather } from "@expo/vector-icons";

import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { LinkButton } from "@/components/linkButton";

const PHONE_NUMBER = "55+DDD+NUMERO";

export default function Cart() {
  const [address, setAddress] = useState("");
  const { products, remove, clear } = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(
    products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => remove(product.id),
      },
    ]);
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe os dados da entrega");
    }

    const productsStore = products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

    const message = `
    🍔 NOVO PEDIDO
    \n Entregar em: ${address}

    ${productsStore}

    \n Valor total: ${total}

    `;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );

    clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {products.length > 0 ? (
              <View className="border-b border-slate-700">
                {products.map((product) => (
                  <Product
                    data={product}
                    key={product.id}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio.
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>

              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <Input
              placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
              onChangeText={setAddress}
              onSubmitEditing={handleOrder}
              blurOnSubmit={true}
              returnKeyType="next"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>
        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
