import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  // Header
  header: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 9,
    color: "#6b7280",
  },

  // Member
  memberSection: {
    marginBottom: 24,
  },

  memberHeader: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  memberName: {
    fontSize: 14,
    fontWeight: "bold",
  },

  memberStats: {
    flexDirection: "row",
    marginTop: 8,
    gap: 20,
  },

  stat: {
    flexDirection: "column",
  },

  statLabel: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 2,
  },

  statValue: {
    fontSize: 10,
    fontWeight: "bold",
  },

  // Order
  order: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,

    // Important:
    // prevents an order from being split awkwardly
    // between pages where possible.
    breakInside: "avoid",
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  orderId: {
    fontSize: 10,
    fontWeight: "bold",
  },

  orderDate: {
    fontSize: 8,
    color: "#6b7280",
  },

  // Financial information
  financials: {
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  label: {
    color: "#6b7280",
  },

  value: {
    fontWeight: "bold",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 7,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  totalLabel: {
    fontWeight: "bold",
  },

  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },

  // Items
  itemsTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
  },

  item: {
    flexDirection: "row",
    marginBottom: 3,
  },

  bullet: {
    width: 10,
  },

  itemName: {
    color: "#374151",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 18,
    left: 32,
    right: 32,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    textAlign: "center",
  },

  footerText: {
    fontSize: 7,
    color: "#9ca3af",
  },
});

const AnalyticsPDFLayout = ({ analytics }) => {
    console.log(analytics);

    return (
        <Document>
        <Page size="A4" style={styles.page}>

            {/* ================= HEADER ================= */}

            <View style={styles.header}>
            <Text style={styles.title}>
                Sales Analytics
            </Text>

            <Text style={styles.subtitle}>
                Generated on {formatDate(Date.now())}
            </Text>
            </View>


            {/* ================= MEMBERS ================= */}

            {analytics.map((member) => {

            const totalOrders =
                member.orders_per_member.length;

            const totalRevenue =
                member.orders_per_member.reduce(
                (sum, order) => sum + order.total,
                0
                );

            return (
                <View
                key={member.id}
                style={styles.memberSection}
                >

                {/* Member header */}

                <View style={styles.memberHeader}>

                    <Text style={styles.memberName}>
                    {member.name}
                    </Text>

                    <View style={styles.memberStats}>

                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>
                        ORDERS
                        </Text>

                        <Text style={styles.statValue}>
                        {totalOrders}
                        </Text>
                    </View>

                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>
                        REVENUE
                        </Text>

                        <Text style={styles.statValue}>
                        Rs. {totalRevenue}
                        </Text>
                    </View>

                    </View>

                </View>


                {/* ================= ORDERS ================= */}

                {member.orders_per_member.map((order) => (

                    <View
                    key={order.order_id}
                    style={styles.order}
                    >

                    {/* Order header */}

                    <View style={styles.orderHeader}>

                        <Text style={styles.orderId}>
                        Order #{order.order_id}
                        </Text>

                        <Text style={styles.orderDate}>
                        {formatDate(order.created_at)}
                        </Text>

                    </View>


                    {/* Financial information */}

                    <View style={styles.financials}>

                        <View style={styles.row}>
                        <Text style={styles.label}>
                            Subtotal
                        </Text>

                        <Text style={styles.value}>
                            Rs. {order.subtotal}
                        </Text>
                        </View>


                        <View style={styles.row}>
                        <Text style={styles.label}>
                            Discount
                            {order.discount_rate > 0
                            ? ` (${order.discount_rate}%)`
                            : ""}
                        </Text>

                        <Text style={styles.value}>
                            Rs. {order.discount_amount}
                        </Text>
                        </View>


                        <View style={styles.row}>
                        <Text style={styles.label}>
                            Tax
                        </Text>

                        <Text style={styles.value}>
                            Rs. {order.tax_amount}
                        </Text>
                        </View>


                        <View style={styles.totalRow}>

                        <Text style={styles.totalLabel}>
                            Total
                        </Text>

                        <Text style={styles.totalValue}>
                            Rs. {order.total}
                        </Text>

                        </View>

                    </View>


                    {/* ================= ITEMS ================= */}

                    <Text style={styles.itemsTitle}>
                        Items
                    </Text>

                    {order.items.map((item, index) => (

                        <View
                        key={`${item.item_id}-${index}`}
                        style={styles.item}
                        >

                        <Text style={styles.bullet}>
                            •
                        </Text>

                        <Text style={styles.itemName}>
                            {item.item_name}
                        </Text>

                        </View>

                    ))}

                    </View>

                ))}

                </View>
            );
            })}


            {/* ================= FOOTER ================= */}

            <View style={styles.footer}>
            <Text style={styles.footerText}>
                Generated by POS System
            </Text>
            </View>

        </Page>
        </Document>
    );
};

export default AnalyticsPDFLayout;